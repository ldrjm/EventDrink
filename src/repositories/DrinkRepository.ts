import SupabaseModel from '../SupabaseModel';
import { Drink } from '../../types';

/**
 * DrinkRepository - Acesso a dados de bebidas
 * Responsabilidade: Comunicação com banco de dados
 */

export const DrinkRepository = {
  /**
   * Buscar todas as bebidas
   */
  async getAll(): Promise<Drink[]> {
    try {
      return await SupabaseModel.getDrinks();
    } catch (error) {
      console.error('[DrinkRepository] Erro ao buscar bebidas:', error);
      throw error;
    }
  },

  /**
   * Buscar bebida por ID
   */
  async getById(id: string): Promise<Drink | null> {
    try {
      const drinks = await SupabaseModel.getDrinks();
      return drinks.find(d => d.id === id) || null;
    } catch (error) {
      console.error('[DrinkRepository] Erro ao buscar bebida:', error);
      throw error;
    }
  },

  /**
   * Criar nova bebida
   */
  async create(drink: Omit<Drink, 'id'>): Promise<Drink> {
    try {
      return await SupabaseModel.insertDrink(drink);
    } catch (error) {
      console.error('[DrinkRepository] Erro ao criar bebida:', error);
      throw error;
    }
  },

  /**
   * Atualizar bebida existente
   */
  async update(id: string, updates: Partial<Drink>): Promise<Drink> {
    try {
      return await SupabaseModel.updateDrink(id, updates);
    } catch (error) {
      console.error('[DrinkRepository] Erro ao atualizar bebida:', error);
      throw error;
    }
  },

  /**
   * Deletar bebida
   */
  async delete(id: string): Promise<void> {
    try {
      await SupabaseModel.deleteDrink(id);
    } catch (error) {
      console.error('[DrinkRepository] Erro ao deletar bebida:', error);
      throw error;
    }
  },

  /**
   * Buscar bebidas por tipo de evento
   */
  async getByEventType(eventType: string): Promise<Drink[]> {
    try {
      const drinks = await SupabaseModel.getDrinks();
      return drinks.filter(d => d.eventTypes?.includes(eventType));
    } catch (error) {
      console.error('[DrinkRepository] Erro ao filtrar bebidas:', error);
      throw error;
    }
  },
};
