import { useState, useCallback } from 'react';
import { DrinkService } from '../services/drinkService';
import { Drink, EventType } from '../types';

/**
 * useDrinks - Hook customizado para gerenciar estado de bebidas
 * Responsabilidade: Lógica de estado e fetching de bebidas
 */

export const useDrinks = (initialEventType?: EventType) => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendedDrinks = useCallback(async (eventType: EventType) => {
    setLoading(true);
    setError(null);
    try {
      const data = await DrinkService.getRecommendedDrinks(eventType);
      setDrinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar bebidas');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopularDrinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DrinkService.getPopularDrinks(10);
      setDrinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar bebidas populares');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSimilarDrinks = useCallback(async (drinkId: string) => {
    try {
      return await DrinkService.getSimilarDrinks(drinkId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar bebidas similares');
      return [];
    }
  }, []);

  // Fetch inicial se eventType foi fornecido
  React.useEffect(() => {
    if (initialEventType) {
      fetchRecommendedDrinks(initialEventType);
    }
  }, [initialEventType, fetchRecommendedDrinks]);

  return {
    drinks,
    loading,
    error,
    fetchRecommendedDrinks,
    fetchPopularDrinks,
    getSimilarDrinks,
  };
};
