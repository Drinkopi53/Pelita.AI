import { useState, useRef, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Bot } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { askLogosJson, askLogosText, PERICOPE_PROMPT } from './services/geminiService';
import { PericopeExplorer, type PericopeData } from './features/PericopeExplorer';
import { AboutModal } from './features/AboutModal';

// Definisikan tipe Message yang lebih fleksibel
export type Message = {
  id: string;
  sender: 'user' | 'logos';
  type: 'text' | 'pericope' | 'profile' | 'error';
  content: string | PericopeData; // Bisa berupa teks atau objek data
};


function App() {
  const initialMessage: Message = { id: 'init', sender: 'logos', type: 'text', content: 'Salam! Saya LOGOS, asisten studi Alkitab Anda. Apa yang ingin Anda pelajari hari ini?' };
  const [messages, setMessages] = useLocalStorage<Message[]>('pelita-ai-messages', [initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (text: string) => {
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', type: 'text', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const pericopeRegex = /jelajahi\s+(.+)/i;
    const profileRegex = /profil\s+(.+)/i;

    const pericopeMatch = text.match(pericopeRegex);
    const profileMatch = text.match(profileRegex);

    let logosResponse: Message;

    try {
      if (pericopeMatch) {
        const pericope = pericopeMatch[1];
        const prompt = PERICOPE_PROMPT(pericope);
        const data = await askLogosJson<PericopeData>(prompt);
        logosResponse = { id: Date.now().toString(), sender: 'logos', type: 'pericope', content: data };
      } else if (profileMatch) {
        // Logika untuk profil tokoh (placeholder)
        logosResponse = { id: Date.now().toString(), sender: 'logos', type: 'text', content: "Fitur profil sedang dikembangkan." };
      } else {
        const responseText = await askLogosText(text);
        logosResponse = { id: Date.now().toString(), sender: 'logos', type: 'text', content: responseText };
      }
    } catch (error) {
        console.error("Error during handleSend:", error);
        logosResponse = { id: Date.now().toString(), sender: 'logos', type: 'error', content: "Maaf, terjadi kesalahan saat memproses permintaan Anda." };
    }


    setMessages(prev => [...prev, logosResponse]);
    setIsLoading(false);
  };

  const handleClearChat = () => {
    setMessages([initialMessage]);
  };

  const handleToggleAbout = () => {
    setIsAboutModalOpen(!isAboutModalOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <Header onClearChat={handleClearChat} onToggleAbout={handleToggleAbout} />
      {isAboutModalOpen && <AboutModal onClose={handleToggleAbout} />}
      <main className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return <ChatMessage key={msg.id} message={{...msg, content: msg.content as string}} />;
            }
            // Pesan dari LOGOS
            switch (msg.type) {
              case 'pericope':
                return <PericopeExplorer key={msg.id} data={msg.content as PericopeData} />;
              case 'profile':
                // return <CharacterProfileCard key={msg.id} data={msg.content} />;
                return <ChatMessage key={msg.id} message={{...msg, content: "Tampilan profil akan ada di sini."}} />;
              case 'error':
                 return <ChatMessage key={msg.id} message={{...msg, content: msg.content as string, isError: true }} />;
              default:
                return <ChatMessage key={msg.id} message={{...msg, content: msg.content as string}} />;
            }
          })}
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
