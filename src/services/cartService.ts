import { OrderRepository } from '../repositories/OrderRepository';
import { DrinkRepository } from '../repositories/DrinkRepository';
import { PastOrder, Drink } from '../../types';

/**
 * CartService - Lógica de negócio para carrinho de compras
 * Responsabilidade: Gerenciar carrinho, cálculos, validações
 */

export const CartService = {
  /**
   * Calcular valor total do carrinho
   */
  calculateTotal(items: Partial<Drink>[]): number {
    return items.reduce((total, item) => total + (item.price || 0), 0);
  },

  /**
   * Aplicar desconto (se cupom válido)
   */
  applyDiscount(total: number, discountPercent: number): number {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Desconto deve estar entre 0 e 100%');
    }
    return total * (1 - discountPercent / 100);
  },

  /**
   * Calcular taxa de entrega
   */
  calculateDeliveryFee(subtotal: number, distance: number): number {
    const baseFee = 5; // R$ 5 base
    const perKm = 0.5; // R$ 0.50 por km
    return baseFee + (distance * perKm);
  },

  /**
   * Calcular total com impostos e taxas
   */
  calculateFinalPrice(
    subtotal: number,
    deliveryFee: number,
    taxPercent: number = 10
  ): number {
    const taxAmount = subtotal * (taxPercent / 100);
    return subtotal + taxAmount + deliveryFee;
  },

  /**
   * Validar carrinho antes de checkout
   */
  validateCart(items: Partial<Drink>[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!items || items.length === 0) {
      errors.push('Carrinho vazio');
    }

    items.forEach((item, index) => {
      if (!item.id) {
        errors.push(`Item ${index + 1}: ID inválido`);
      }
      if (!item.price || item.price <= 0) {
        errors.push(`Item ${index + 1}: Preço inválido`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Sugerir bebidas adicionais (up-sell)
   */
  async suggestAddOns(currentItems: Drink[]): Promise<Drink[]> {
    const allDrinks = await DrinkRepository.getAll();
    const currentIds = new Set(currentItems.map(i => i.id));

    // Retornar bebidas que não estão no carrinho
    return allDrinks
      .filter(d => !currentIds.has(d.id))
      .slice(0, 3);
  },

  /**
   * Criar pedido a partir do carrinho
   */
  async createOrderFromCart(
    items: Drink[],
    userId: string,
    deliveryAddress: string
  ): Promise<PastOrder> {
    const validation = this.validateCart(items);
    if (!validation.valid) {
      throw new Error(`Carrinho inválido: ${validation.errors.join(', ')}`);
    }

    const subtotal = this.calculateTotal(items);
    const deliveryFee = this.calculateDeliveryFee(subtotal, 2); // 2km default
    const finalPrice = this.calculateFinalPrice(subtotal, deliveryFee);

    const order: Omit<PastOrder, 'id'> = {
      user_id: userId,
      drinks: items,
      total_price: finalPrice,
      status: 'pending',
      delivery_address: deliveryAddress,
      created_at: new Date().toISOString(),
    };

    return await OrderRepository.create(order);
  },
};
