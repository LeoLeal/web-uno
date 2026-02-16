'use client';

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';

export const HostDisconnectModal = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasNavigated = useRef(false);

  // Countdown timer effect - only handles state updates
  useEffect(() => {
    hasNavigated.current = false;

    // Countdown timer
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Stop at 0, don't navigate here
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Navigation effect - watches countdown and navigates when it hits 0
  useEffect(() => {
    if (countdown === 0 && !hasNavigated.current) {
      hasNavigated.current = true;
      // Small delay to ensure cleanup completes
      setTimeout(() => {
        navigate('/');
      }, 100);
    }
  }, [countdown, navigate]);

  return (
    <Modal isOpen={true} aria-labelledby="disconnect-modal-title">
      {/* Icon */}
      <div className="text-6xl text-center">👋</div>

      {/* Title */}
      <h2 id="disconnect-modal-title" className="text-2xl font-bold text-(--cream) text-center mt-6">
        Host Disconnected
      </h2>

      {/* Message */}
      <p className="text-(--cream-dark) opacity-80 text-lg text-center mt-4">
        The game cannot continue without the host.
      </p>

      {/* Countdown */}
      <div className="py-4 text-center">
        <p className="text-red-400 font-mono text-xl">Returning to home in {countdown}...</p>
      </div>

      {/* Info */}
      <p className="text-sm text-(--cream-dark) opacity-60 text-center">
        You can join a new game or create your own room.
      </p>
    </Modal>
  );
};
