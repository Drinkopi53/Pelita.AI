import React from 'react';
import { Button } from '../ui/Button';
import { Trash2, Info } from 'lucide-react';

interface HeaderProps {
  onClearChat: () => void;
  onToggleAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClearChat, onToggleAbout }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pelita<span className="text-blue-600">.AI</span></h1>
          <p className="text-sm text-gray-500">Sahabat Digital Anda untuk Menyelami Firman</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleAbout} aria-label="Tentang Pelita.AI">
            <Info size={20} />
          </Button>
          <Button variant="secondary" onClick={onClearChat} aria-label="Hapus obrolan">
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};
