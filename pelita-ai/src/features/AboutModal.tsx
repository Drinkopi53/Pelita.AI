import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Card className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Tentang Pelita.AI</h2>
        <div className="prose max-w-none">
          <p>
            <strong>Filosofi Pelita.AI:</strong>
          </p>
          <p>
            Pelita.AI (LOGOS) dirancang sebagai alat bantu studi Alkitab yang netral dan berfokus pada teks. Tujuan kami adalah menyediakan akses yang mudah terhadap konteks historis, analisis linguistik, dan hubungan antar-ayat tanpa memihak pada denominasi atau doktrin teologis tertentu.
          </p>
          <p>
            Kami percaya bahwa pemahaman yang lebih dalam terhadap Alkitab dapat dicapai dengan mendekati teks secara objektif. LOGOS tidak akan memberikan nasihat pribadi atau jawaban atas pertanyaan di luar lingkup analisis Alkitab.
          </p>
        </div>
        <div className="text-right mt-6">
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </Card>
    </div>
  );
};
