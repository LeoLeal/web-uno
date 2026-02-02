import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface HostDisconnectModalProps {
  isOpen: boolean;
}

export const HostDisconnectModal = ({ isOpen }: HostDisconnectModalProps) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) return;

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Redirect to home when countdown reaches 0
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, router]);

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
