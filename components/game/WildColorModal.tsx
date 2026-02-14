'use client';

import { CardColor, CARD_COLORS } from '@/lib/game/cards';
import { Modal } from '@/components/ui/Modal';

interface WildColorModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Called when a color is selected */
  onSelect: (color: CardColor) => void;
  /** Called when the modal is dismissed/canceled */
  onCancel: () => void;
}

const colorStyles: Record<CardColor, string> = {
  red: 'bg-[#ed1c24] hover:bg-[#d11820]',
  blue: 'bg-[#0077c0] hover:bg-[#0066a8]',
  yellow: 'bg-[#ffcc00] hover:bg-[#e6b800]',
  green: 'bg-[#00a651] hover:bg-[#009547]',
};

const colorNames: Record<CardColor, string> = {
  red: 'Red',
  blue: 'Blue',
  yellow: 'Yellow',
  green: 'Green',
};

/**
 * Modal for selecting a color when playing a wild card.
 * Displays 4 color buttons (red, blue, yellow, green).
 */
export const WildColorModal = ({
  isOpen,
  onSelect,
  onCancel,
}: WildColorModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-(--cream)">Choose a Color</h2>
        <div className="grid grid-cols-2 gap-4">
          {CARD_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={`
                ${colorStyles[color]}
                h-24 rounded-lg
                text-white font-bold text-lg
                transition-transform hover:scale-105
                active:scale-95
                shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-4 focus:ring-white/50
              `}
              aria-label={`Choose ${colorNames[color]}`}
            >
              {colorNames[color]}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};
