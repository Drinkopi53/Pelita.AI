import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Definisikan tipe data untuk output AI
export interface PericopeData {
  ringkasan: string;
  tokoh_dan_latar: { nama: string; deskripsi: string; }[];
  kata_kunci: { kata: string; makna: string; }[];
  kaitan_lintas_ayat: { ayat: string; penjelasan: string; }[];
  pertanyaan_refleksi: string[];
}

interface PericopeExplorerProps {
  data: PericopeData;
}

type Tab = 'ringkasan' | 'tokoh' | 'kata' | 'kaitan' | 'refleksi';

export const PericopeExplorer: React.FC<PericopeExplorerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<Tab>('ringkasan');

  const renderContent = () => {
    switch (activeTab) {
      case 'ringkasan': return <p>{data.ringkasan}</p>;
      case 'tokoh': return (
        <ul>{data.tokoh_dan_latar.map(t => <li key={t.nama}><strong>{t.nama}:</strong> {t.deskripsi}</li>)}</ul>
      );
      // ... (kasus lain untuk kata_kunci, kaitan_lintas_ayat, pertanyaan_refleksi)
      default: return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <div className="border-b mb-4 flex space-x-2">
        <Button variant={activeTab === 'ringkasan' ? 'primary' : 'secondary'} onClick={() => setActiveTab('ringkasan')}>Ringkasan</Button>
        <Button variant={activeTab === 'tokoh' ? 'primary' : 'secondary'} onClick={() => setActiveTab('tokoh')}>Tokoh</Button>
        {/* ... (tombol tab lainnya) */}
      </div>
      <div className="prose max-w-none">{renderContent()}</div>
    </Card>
  );
};
