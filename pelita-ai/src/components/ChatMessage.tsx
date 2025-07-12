import React from 'react';
import { User, Bot } from 'lucide-react';
import { Card } from './ui/Card';

export interface Message {
  sender: 'user' | 'logos';
  text: string;
}

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <Bot size={24} />
        </div>
      )}
      <Card className={`max-w-lg ${isUser ? 'bg-blue-50 text-gray-800' : 'bg-white'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </Card>
       {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
          <User size={24} />
        </div>
      )}
    </div>
  );
};
