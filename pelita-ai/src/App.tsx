import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { ChatMessage, Message } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Bot } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'logos', text: 'Salam! Saya LOGOS, asisten studi Alkitab Anda. Apa yang ingin Anda pelajari hari ini?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (text: string) => {
    const userMessage: Message = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Placeholder for AI response
    setTimeout(() => {
      const logosResponse: Message = { sender: 'logos', text: `Anda bertanya: "${text}". Fungsi AI belum terhubung.` };
      setMessages(prev => [...prev, logosResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 my-4 justify-start">
               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <Bot size={24} />
               </div>
               <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                  </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}

export default App;
