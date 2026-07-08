import React from 'react';

/**
 * SafeImage - Componente para carregar imagens com fallback
 * Pasta: components/common/
 * Responsabilidade: Exibir imagem com tratamento de erro
 */

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = 'https://via.placeholder.com/300',
  className = '',
  objectFit = 'cover',
}) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={handleError}
      className={className}
      style={{ objectFit }}
    />
  );
};

export default SafeImage;
