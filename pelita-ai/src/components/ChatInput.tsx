import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from './ui/Button';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Tanya apa saja atau coba 'jelajahi Yohanes 3:16'"
          className="w-full p-3 pr-16 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          rows={1}
          disabled={isLoading}
        />
        <Button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2" disabled={isLoading}>
          <Send size={20} />
        </Button>
      </div>
    </form>
  );
};
