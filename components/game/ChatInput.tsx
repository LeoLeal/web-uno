import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const ChatInput = ({ onSendMessage, placeholder = "Type a chat message...", className, autoFocus }: ChatInputProps) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onSendMessage(trimmed);
      setText('');
      // Optional: keep focus after sending
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          styles.chatInput,
          "w-full resize-none rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-(--copper-border) py-3 sm:py-3.5 pl-4 sm:pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-(--copper-light) shadow-lg text-black",
          "min-h-[48px] placeholder:text-gray-500 overflow-hidden"
        )}
        rows={1}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!text.trim()}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-xl text-(--copper-dark) hover:text-white disabled:text-white transition-colors",
          text.trim() ? "bg-(--copper) hover:bg-(--copper-dark)" : "bg-gray-400 cursor-not-allowed"
        )}
        aria-label="Send message"
      >
        <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </button>
    </div>
  );
};
