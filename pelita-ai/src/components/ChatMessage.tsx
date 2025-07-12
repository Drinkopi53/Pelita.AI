import React from 'react';
import { User, Bot, AlertTriangle } from 'lucide-react';
import { Card } from './ui/Card';
import type { Message as MessageType } from '../App'; // Import tipe dari App

// Komponen ini sekarang menerima subset dari tipe Message utama
interface ChatMessageProps {
  message: {
    sender: 'user' | 'logos';
    content: string; // Selalu string karena data object dirender oleh komponen lain
    isError?: boolean;
  }
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { sender, content, isError } = message;
  const isUser = sender === 'user';

  const icon = isUser ?
    <User size={24} /> :
    isError ?
    <AlertTriangle size={24} /> :
    <Bot size={24} />;

  const iconBgColor = isUser ?
    'bg-gray-600' :
    isError ?
    'bg-red-500' :
    'bg-blue-500';

  const cardBgColor = isUser ?
    'bg-blue-50' :
    isError ?
    'bg-red-50' :
    'bg-white';

  const cardTextColor = isError ? 'text-red-800' : 'text-gray-800';


  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center text-white`}>
          {icon}
        </div>
      )}
      <Card className={`max-w-3xl ${cardBgColor} ${cardTextColor}`}>
        <p className="whitespace-pre-wrap">{content}</p>
      </Card>
       {isUser && (
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center text-white`}>
          {icon}
        </div>
      )}
    </div>
  );
};
