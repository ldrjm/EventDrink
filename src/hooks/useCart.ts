import { useState, useCallback } from 'react';
import { CartService } from '../services/cartService';
import { Drink } from '../types';

/**
 * useCart - Hook customizado para gerenciar carrinho de compras
 * Responsabilidade: Estado do carrinho, cálculos, persistência
 */

export const useCart = () => {
  const [items, setItems] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCallback((drink: Drink) => {
    setItems(prev => [...prev, drink]);
  }, []);

  const removeItem = useCallback((drinkId: string, index?: number) => {
    setItems(prev => {
      if (index !== undefined) {
        // Remove item específico por índice (para permitir duplicatas)
        return prev.filter((_, i) => i !== index);
      }
      // Remove primeiro item com esse ID
      return prev.filter(d => d.id !== drinkId);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const updateQuantity = useCallback((drinkId: string, quantity: number) => {
    setItems(prev => {
      const filtered = prev.filter(d => d.id !== drinkId);
      const drink = prev.find(d => d.id === drinkId);
      if (drink && quantity > 0) {
        return [...filtered, ...Array(quantity).fill(drink)];
      }
      return filtered;
    });
  }, []);

  const getTotal = useCallback(() => {
    return CartService.calculateTotal(items);
  }, [items]);

  const checkoutCart = useCallback(
    async (userId: string, deliveryAddress: string) => {
      setLoading(true);
      setError(null);
      try {
        const order = await CartService.createOrderFromCart(
          items,
          userId,
          deliveryAddress
        );
        setItems([]); // Limpar carrinho após sucesso
        return order;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao processar pedido';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [items]
  );

  return {
    items,
    loading,
    error,
    addItem,
    removeItem,
    clearCart,
    updateQuantity,
    getTotal,
    checkoutCart,
    itemCount: items.length,
  };
};
