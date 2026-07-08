import SupabaseModel from '../SupabaseModel';
import { PastOrder } from '../../types';

/**
 * OrderRepository - Acesso a dados de pedidos
 * Responsabilidade: Comunicação com banco de dados
 */

export const OrderRepository = {
  /**
   * Buscar todos os pedidos
   */
  async getAll(): Promise<PastOrder[]> {
    try {
      return await SupabaseModel.getOrders();
    } catch (error) {
      console.error('[OrderRepository] Erro ao buscar pedidos:', error);
      throw error;
    }
  },

  /**
   * Buscar pedidos de um usuário
   */
  async getByUserId(userId: string): Promise<PastOrder[]> {
    try {
      const orders = await SupabaseModel.getOrders();
      return orders.filter(o => o.user_id === userId);
    } catch (error) {
      console.error('[OrderRepository] Erro ao buscar pedidos do usuário:', error);
      throw error;
    }
  },

  /**
   * Criar novo pedido
   */
  async create(order: Omit<PastOrder, 'id'>): Promise<PastOrder> {
    try {
      return await SupabaseModel.insertOrder(order);
    } catch (error) {
      console.error('[OrderRepository] Erro ao criar pedido:', error);
      throw error;
    }
  },

  /**
   * Atualizar pedido
   */
  async update(id: string, updates: Partial<PastOrder>): Promise<PastOrder> {
    try {
      return await SupabaseModel.updateOrder(id, updates);
    } catch (error) {
      console.error('[OrderRepository] Erro ao atualizar pedido:', error);
      throw error;
    }
  },

  /**
   * Deletar pedido
   */
  async delete(id: string): Promise<void> {
    try {
      await SupabaseModel.deleteOrder(id);
    } catch (error) {
      console.error('[OrderRepository] Erro ao deletar pedido:', error);
      throw error;
    }
  },

  /**
   * Buscar pedidos por intervalo de datas
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<PastOrder[]> {
    try {
      const orders = await SupabaseModel.getOrders();
      return orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= startDate && orderDate <= endDate;
      });
    } catch (error) {
      console.error('[OrderRepository] Erro ao filtrar pedidos por data:', error);
      throw error;
    }
  },
};
