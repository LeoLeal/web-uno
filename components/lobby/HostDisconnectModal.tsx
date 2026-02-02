import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface HostDisconnectModalProps {
  isOpen: boolean;
}

export const HostDisconnectModal = ({ isOpen }: HostDisconnectModalProps) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasNavigated = useRef(false);

  // Countdown timer effect - only handles state updates
  useEffect(() => {
    if (!isOpen) return;

    // Reset state when modal opens
    setCountdown(5);
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
  }, [isOpen]);

  // Navigation effect - watches countdown and navigates when it hits 0
  useEffect(() => {
    if (!isOpen) return;
    if (countdown === 0 && !hasNavigated.current) {
      hasNavigated.current = true;
      // Small delay to ensure cleanup completes
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
  }, [countdown, isOpen, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-red-500/50 w-full max-w-md p-8 rounded-2xl shadow-2xl text-center space-y-6">
        {/* Icon */}
        <div className="text-6xl">👋</div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-white">
          Host Disconnected
        </h2>
        
        {/* Message */}
        <p className="text-slate-400 text-lg">
          The game cannot continue without the host.
        </p>
        
        {/* Countdown */}
        <div className="py-4">
          <p className="text-red-400 font-mono text-xl">
            Returning to home in {countdown}...
          </p>
        </div>
        
        {/* Info */}
        <p className="text-sm text-slate-500">
          You can join a new game or create your own room.
        </p>
      </div>
    </div>
  );
};
