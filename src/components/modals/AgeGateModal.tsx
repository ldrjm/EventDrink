import React from 'react';

/**
 * AgeGateModal - Modal de verificação de idade
 * Pasta: components/modals/
 * Responsabilidade: Exibir modal de age gate, bloquear acesso se menor
 */

interface AgeGateModalProps {
  onConfirm: (isAdult: boolean) => void;
}

const AgeGateModal: React.FC<AgeGateModalProps> = ({ onConfirm }) => {
  const [selectedYear, setSelectedYear] = React.useState<string>('');

  const handleSubmit = () => {
    if (!selectedYear) return;

    const birthYear = parseInt(selectedYear);
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    onConfirm(age >= 18);
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Verificação de Idade</h2>
        <p className="text-gray-600 mb-6 text-center">
          Você deve ter 18 anos ou mais para acessar o EventDrink.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Selecione seu ano de nascimento:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Escolha --</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedYear}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default AgeGateModal;
