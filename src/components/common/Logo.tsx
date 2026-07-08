import React from 'react';

/**
 * EventDrinkLogo - Componente de Logo reutilizável
 * Pasta: components/common/
 * Responsabilidade: Exibir logo da aplicação
 */

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const EventDrinkLogo: React.FC<LogoProps> = ({ size = 'medium', onClick }) => {
  const sizeMap = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32',
  };

  return (
    <div
      className={`${sizeMap[size]} cursor-pointer transition-transform hover:scale-105`}
      onClick={onClick}
      role="img"
      aria-label="EventDrink Logo"
    >
      {/* Logo SVG or Image */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Adicione o SVG da logo aqui */}
      </svg>
    </div>
  );
};

export default EventDrinkLogo;
