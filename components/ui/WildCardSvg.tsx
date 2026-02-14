import { CardColor, WildSymbol } from '@/lib/game/cards';
import { cn } from '@/lib/utils';
import styles from './WildCard.module.css';

interface WildCardSvgProps {
  /** Wild card symbol */
  symbol: WildSymbol;
  /** Chosen color (if the wild has been played) */
  color?: CardColor;
  /** Size - maps to width/height (ignored if width/height are provided) */
  size?: 'sm' | 'md' | 'lg';
  /** Explicit width (overrides size) */
  width?: number;
  /** Explicit height (overrides size) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

const sizeMap = {
  sm: { width: 40, height: 60 },
  md: { width: 80, height: 120 },
  lg: { width: 56, height: 84 },
};

/**
 * Renders wild card SVGs with CSS-controlled color quadrants.
 * When a color is specified, only that color quadrant is shown; others are grayscale.
 * SVG content is inlined for Turbopack compatibility.
 */
export const WildCardSvg = ({
  symbol,
  color,
  size = 'md',
  width: explicitWidth,
  height: explicitHeight,
  className,
}: WildCardSvgProps) => {
  // Use explicit dimensions if provided, otherwise fall back to size map
  const width = explicitWidth ?? sizeMap[size].width;
  const height = explicitHeight ?? sizeMap[size].height;

  const wrapperClass = cn(
    color && styles[`chosen-${color}`],
    className
  );

  if (symbol === 'wild') {
    return (
      <div className={wrapperClass} style={{ width, height }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 90" width={width} height={height}>
          <rect width="60" height="90" rx="10" ry="10" x="0" y="0" style={{ fill: '#ffffff', stroke: '#000000', strokeWidth: 0.5 }}/>
          <rect width="50" height="80" rx="5" ry="5" x="5" y="5" style={{ fill: '#000000' }}/>
          <path d="m 45 20 c -22.09139 0 -40 17.90861 -40 40 0 5.52285 4.47715 10 10 10 22.09139 0 40 -17.90861 40 -40 0 -5.52285 -4.47715 -10 -10 -10 z" style={{ fill: '#ffffff' }}/>
          <path d="m 45 20 c -16.78 0 -31.13 10.35 -37.06 25 l 22.06 0 15 -25 z" className="quad-red"/>
          <path d="m 45 20 -15 25 22.06 0 c 1.88 -4.64 2.94 -9.69 2.94 -15 0 -5.52 -4.48 -10 -10 -10 z" className="quad-blue"/>
          <path d="m 7.94 45 c -1.88 4.64 -2.94 9.69 -2.94 15 0 5.52 4.48 10 10 10 l 15 -25 -22.06 0 z" className="quad-yellow"/>
          <path d="m 30 45 -15 25 c 16.78 0 31.13 -10.35 37.06 -25 l -22.06 0 z" className="quad-green"/>
          <path d="m 45 20 c -16.78 0 -31.13 10.35 -37.06 25 -1.88 4.64 -2.94 9.69 -2.94 15 0 5.52 4.48 10 10 10 16.78 0 31.13 -10.35 37.06 -25 1.88 -4.64 2.94 -9.69 2.94 -15 0 -5.52 -4.48 -10 -10 -10 z" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 1 }}/>
          <path d="m 17.5 7.5 c -4.2 0 -7.78 2.59 -9.27 6.25 -0.47 1.16 -0.73 2.42 -0.73 3.75 0 1.38 1.12 2.5 2.5 2.5 4.2 0 7.78 -2.59 9.27 -6.25 0.47 -1.16 0.73 -2.42 0.73 -3.75 0 -1.38 -1.12 -2.5 -2.5 -2.5 z" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 1 }}/>
          <path d="m 50 70 c -4.2 0 -7.78 2.59 -9.27 6.25 -0.47 1.16 -0.73 2.42 -0.73 3.75 0 1.38 1.12 2.5 2.5 2.5 4.2 0 7.78 -2.59 9.27 -6.25 0.47 -1.16 0.73 -2.42 0.73 -3.75 0 -1.38 -1.12 -2.5 -2.5 -2.5 z" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 1 }}/>
          <path d="m 17.5 7.5 -3.75 6.25 5.52 0 c 0.47 -1.16 0.73 -2.42 0.73 -3.75 0 -1.38 -1.12 -2.5 -2.5 -2.5 z" className="quad-blue"/>
          <path d="m 17.5 7.5 c -4.2 0 -7.78 2.59 -9.27 6.25 l 5.52 0 3.75 -6.25 z" className="quad-red"/>
          <path d="m 8.23 13.75 c -0.47 1.16 -0.73 2.42 -0.73 3.75 0 1.38 1.12 2.5 2.5 2.5 l 3.75 -6.25 -5.52 0 z" className="quad-yellow"/>
          <path d="m 13.75 13.75 -3.75 6.25 c 4.2 0 7.78 -2.59 9.27 -6.25 l -5.52 0 z" className="quad-green"/>
          <path d="m 50 70 -3.75 6.25 5.52 0 c 0.47 -1.16 0.73 -2.42 0.73 -3.75 0 -1.38 -1.12 -2.5 -2.5 -2.5 z" className="quad-blue"/>
          <path d="m 50 70 c -4.2 0 -7.78 2.59 -9.27 6.25 l 5.52 0 3.75 -6.25 z" className="quad-red"/>
          <path d="m 40.73 76.25 c -0.47 1.16 -0.73 2.42 -0.73 3.75 0 1.38 1.12 2.5 2.5 2.5 l 3.75 -6.25 -5.52 0 z" className="quad-yellow"/>
          <path d="m 46.25 76.25 -3.75 6.25 c 4.2 0 7.78 -2.59 9.27 -6.25 l -5.52 0 z" className="quad-green"/>
        </svg>
      </div>
    );
  }

  // wild-draw4
  return (
    <div className={wrapperClass} style={{ width, height }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 90" width={width} height={height}>
        <rect width="60" height="90" rx="10" ry="10" x="0" y="0" style={{ fill: '#ffffff', stroke: '#000000', strokeWidth: 0.5 }}/>
        <rect width="50" height="80" rx="5" ry="5" x="5" y="5" style={{ fill: '#000000' }}/>
        <path d="m 45 20 c -22.09139 0 -40 17.90861 -40 40 0 5.52285 4.47715 10 10 10 22.09139 0 40 -17.90861 40 -40 0 -5.52285 -4.47715 -10 -10 -10 z" style={{ fill: '#ffffff' }}/>
        <path d="m 45 20 c -16.78 0 -31.13 10.35 -37.06 25 -1.88 4.64 -2.94 9.69 -2.94 15 0 5.52 4.48 10 10 10 16.78 0 31.13 -10.35 37.06 -25 1.88 -4.64 2.94 -9.69 2.94 -15 0 -5.52 -4.48 -10 -10 -10 z" style={{ fill: 'none', stroke: '#ffffff', strokeWidth: 1 }}/>
        <path d="m 19.9 7.5 -4.9 10 0 2.5 6 0 0 2.5 2.5 0 0 -2.5 1.5 0 0 -2.5 -1.5 0 0 -5 -2.5 0 0 5 -3.4 0 4.9 -10 z" style={{ fill: '#ffffff' }}/>
        <path d="m 8.5 12.5 0 2.5 -2.5 0 0 2.5 2.5 0 0 2.5 2.5 0 0 -2.5 2.5 0 0 -2.5 -2.5 0 0 -2.5 -2.5 0 z" style={{ fill: '#ffffff' }}/>
        <path d="m 40.1 82.5 4.9 -10 0 -2.5 -6 0 0 -2.5 -2.5 0 0 2.5 -1.5 0 0 2.5 1.5 0 0 5 2.5 0 0 -5 3.4 0 -4.9 10 z" style={{ fill: '#ffffff' }}/>
        <path d="m 51.5 77.5 0 -2.5 2.5 0 0 -2.5 -2.5 0 0 -2.5 -2.5 0 0 2.5 -2.5 0 0 2.5 2.5 0 0 2.5 2.5 0 z" style={{ fill: '#ffffff' }}/>
        <g transform="translate(25, 36)">
          <g transform="skewX(-15) translate(-4, 2)">
            <rect width="10" height="15" rx="1.5" ry="1.5" style={{ fill: '#ffffff', stroke: '#000000', strokeWidth: 0.3 }}/>
            <rect x="1" y="1" width="8" height="12" rx="1" ry="1" className="quad-red"/>
          </g>
          <g transform="skewX(-15) translate(0, -2)">
            <rect width="10" height="15" rx="1.5" ry="1.5" style={{ fill: '#ffffff', stroke: '#000000', strokeWidth: 0.3 }}/>
            <rect x="1" y="1" width="8" height="12" rx="1" ry="1" className="quad-blue"/>
          </g>
          <g transform="skewX(-15) translate(4, 4)">
            <rect width="10" height="15" rx="1.5" ry="1.5" style={{ fill: '#ffffff', stroke: '#000000', strokeWidth: 0.3 }}/>
            <rect x="1" y="1" width="8" height="12" rx="1" ry="1" className="quad-yellow"/>
          </g>
          <g transform="skewX(-15) translate(8, 0)">
            <rect width="10" height="15" rx="1.5" ry="1.5" style={{ fill: '#ffffff', stroke: '#000000', strokeWidth: 0.3 }}/>
            <rect x="1" y="1" width="8" height="12" rx="1" ry="1" className="quad-green"/>
          </g>
        </g>
      </svg>
    </div>
  );
};
