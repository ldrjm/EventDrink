import React from 'react';

/**
 * ChatWidget - Widget de chat reutilizável
 * Pasta: components/common/
 * Responsabilidade: Exibir widget de chat
 */

interface ChatWidgetProps {
  onClose?: () => void;
  isOpen?: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose, isOpen = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">Chat de Suporte</h3>
        <button
          onClick={onClose}
          className="text-lg font-bold hover:bg-red-700 p-1 rounded"
        >
          ✕
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <p className="text-gray-500 text-sm">Bem-vindo ao suporte EventDrink!</p>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-600"
        />
      </div>
    </div>
  );
};

export default ChatWidget;
