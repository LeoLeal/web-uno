'use client';

interface GameAlreadyStartedModalProps {
  isOpen: boolean;
}

/**
 * Modal shown to late joiners when a game is already in progress.
 */
export const GameAlreadyStartedModal = ({ isOpen }: GameAlreadyStartedModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="panel-felt p-8 max-w-md mx-4 text-center">
        {/* Icon */}
        <div className="text-6xl mb-4">🚫</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-(--cream) mb-2">
          Game Already Started
        </h2>

        {/* Message */}
        <p className="text-(--cream-dark) opacity-70 mb-6">
          This game is already in progress. You cannot join a game that has already started.
        </p>

        {/* Home button */}
        <a
          href="/"
          className="btn-copper"
        >
          ← Return to Home
        </a>
      </div>
    </div>
  );
};
