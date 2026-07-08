import React from 'react';
import { Drink } from '../../types';

/**
 * DrinkCreator - Componente para criar/editar bebida
 * Pasta: components/features/
 * Responsabilidade: Formulário de criação/edição de bebida
 */

interface DrinkCreatorProps {
  onSubmit: (drink: Partial<Drink>) => Promise<void>;
  initialData?: Drink;
  isLoading?: boolean;
}

const DrinkCreator: React.FC<DrinkCreatorProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<Partial<Drink>>(
    initialData || {
      name: '',
      description: '',
      price: 0,
      eventTypes: [],
    }
  );
  const [error, setError] = React.useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({ name: '', description: '', price: 0, eventTypes: [] });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar bebida');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg">
      <h3 className="text-lg font-bold">
        {initialData ? 'Editar Bebida' : 'Criar Nova Bebida'}
      </h3>

      <div>
        <label className="block text-sm font-medium mb-1">Nome</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          disabled={isLoading}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Preço (R$)</label>
        <input
          type="number"
          name="price"
          value={formData.price || 0}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          disabled={isLoading}
          step="0.01"
          min="0"
          required
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        {isLoading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
      </button>
    </form>
  );
};

export default DrinkCreator;
