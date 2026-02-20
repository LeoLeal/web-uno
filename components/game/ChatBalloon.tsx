import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/lib/websocket/ChatNetwork';
import { CHAT_MESSAGE_DURATION_MS } from '@/lib/game/constants';
import styles from './ChatBalloon.module.css';

interface ChatBalloonProps {
  messages: ChatMessage[];
  anchorName?: string;
}

export const ChatBalloon = ({ messages, anchorName }: ChatBalloonProps) => {
  const [now, setNow] = useState(() => Date.now());

  // Use a rAF or interval to smoothly update the current time so we can trigger fade outs
  useEffect(() => {
    if (messages.length === 0) return;
    
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100); // 100ms precision is good enough for fade-outs
    
    return () => clearInterval(interval);
  }, [messages.length]);

  // A message is visible if it's less than CHAT_MESSAGE_DURATION_MS old
  const visibleMessages = messages.filter(m => now - m.timestamp < CHAT_MESSAGE_DURATION_MS);

  if (visibleMessages.length === 0) return null;

  return (
    <div
      className={cn(
        styles.chatBalloon,
        'z-40 px-3 py-2 rounded-xl bg-white text-black text-sm shadow-xl max-w-[200px] min-w-[60px] pointer-events-none'
      )}
      style={anchorName ? { positionAnchor: anchorName } as React.CSSProperties : undefined}
    >
      <div className="flex flex-col gap-1">
        {visibleMessages.map((msg, index) => {
          const age = now - msg.timestamp;
          // Start fading out in the last 500ms
          const isFadingOut = age > CHAT_MESSAGE_DURATION_MS - 500; 
          return (
            <div 
              key={msg.id} 
              className={cn(
                'break-words transition-opacity duration-500', 
                isFadingOut ? 'opacity-0' : 'opacity-100',
                styles.messageFadeIn,
                index > 0 && 'border-t border-gray-100 pt-1 mt-1' // Divider for appended messages
              )}
            >
              {msg.text}
            </div>
          );
        })}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[8px] border-l-transparent border-t-[10px] border-t-white border-r-[8px] border-r-transparent" />
    </div>
  );
};
