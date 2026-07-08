import { DrinkRepository } from '../repositories/DrinkRepository';
import { OrderRepository } from '../repositories/OrderRepository';
import { Drink, PastOrder, EventType } from '../../types';

/**
 * DrinkService - Lógica de negócio para bebidas
 * Responsabilidade: Regras de negócio, validações, transformações
 */

export const DrinkService = {
  /**
   * Obter bebidas recomendadas para um tipo de evento
   */
  async getRecommendedDrinks(eventType: EventType): Promise<Drink[]> {
    const drinks = await DrinkRepository.getByEventType(eventType);
    // Ordenar por rating/popularidade
    return drinks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  },

  /**
   * Calcular bebida ideal baseado em tipo de evento e número de pessoas
   */
  async calculateIdealDrink(
    eventType: EventType,
    numberOfPeople: number,
    budget?: number
  ): Promise<Drink | null> {
    const drinks = await DrinkRepository.getByEventType(eventType);
    
    if (!drinks.length) return null;

    // Filtrar por orçamento se fornecido
    let filtered = budget 
      ? drinks.filter(d => d.price <= budget / numberOfPeople)
      : drinks;

    if (!filtered.length) filtered = drinks;

    // Retornar a bebida melhor avaliada
    return filtered.reduce((best, current) => 
      (current.rating || 0) > (best.rating || 0) ? current : best
    );
  },

  /**
   * Buscar bebidas populares (baseado em histórico de pedidos)
   */
  async getPopularDrinks(limit: number = 5): Promise<Drink[]> {
    const allDrinks = await DrinkRepository.getAll();
    const orders = await OrderRepository.getAll();

    // Contar quantas vezes cada bebida foi pedida
    const drinkCounts = new Map<string, number>();
    orders.forEach(order => {
      const drinkId = order.drinks?.[0]?.id;
      if (drinkId) {
        drinkCounts.set(drinkId, (drinkCounts.get(drinkId) || 0) + 1);
      }
    });

    // Ordenar e retornar as top N
    return allDrinks
      .sort((a, b) => (drinkCounts.get(b.id) || 0) - (drinkCounts.get(a.id) || 0))
      .slice(0, limit);
  },

  /**
   * Validar dados de bebida antes de salvar
   */
  validateDrink(drink: Partial<Drink>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!drink.name || drink.name.trim().length === 0) {
      errors.push('Nome da bebida é obrigatório');
    }

    if (!drink.price || drink.price <= 0) {
      errors.push('Preço deve ser maior que zero');
    }

    if (!drink.eventTypes || drink.eventTypes.length === 0) {
      errors.push('Pelo menos um tipo de evento é obrigatório');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Buscar bebidas similar a uma especificada
   */
  async getSimilarDrinks(drinkId: string, limit: number = 3): Promise<Drink[]> {
    const drink = await DrinkRepository.getById(drinkId);
    if (!drink) return [];

    const allDrinks = await DrinkRepository.getAll();
    
    // Encontrar bebidas com tipos de evento similares
    return allDrinks
      .filter(d => 
        d.id !== drinkId && 
        d.eventTypes?.some(et => drink.eventTypes?.includes(et))
      )
      .slice(0, limit);
  },
};
