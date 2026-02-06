'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

type CardColor = 'red' | 'blue' | 'yellow' | 'green';
type CardSymbol = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'reverse' | 'skip' | 'plus2' | 'wild' | 'wild-draw4';

interface UnoCardProps {
  color: CardColor;
  symbol: CardSymbol;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { width: 40, height: 60 },
  md: { width: 80, height: 120 },
  lg: { width: 56, height: 84 },
};

/**
 * Maps card color and symbol to the SVG file path.
 * SVG files are extracted from the official UNO deck.
 */
const getCardPath = (color: CardColor, symbol: CardSymbol): string => {
  // Wild cards don't have a color prefix
  if (symbol === 'wild' || symbol === 'wild-draw4') {
    return `/cards/${symbol}.svg`;
  }
  
  return `/cards/${color}-${symbol}.svg`;
};

export const UnoCard = ({
  color,
  symbol,
  rotation = 0,
  className,
  style,
  size = 'md',
}: UnoCardProps) => {
  const dimensions = sizeMap[size];
  const cardPath = getCardPath(color, symbol);
  const altText = `${color} ${symbol} card`;

  return (
    <div
      className={cn('relative', className)}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        transform: `rotate(${rotation}deg)`,
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))',
        ...style,
      }}
    >
      <Image
        src={cardPath}
        alt={altText}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
        priority
      />
    </div>
  );
};
