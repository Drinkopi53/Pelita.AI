import React from 'react';
import { Card } from '../components/ui/Card';
import { User, Star, Book, Key } from 'lucide-react';

// Definisikan tipe data yang cocok dengan PROFILE_PROMPT
export interface ProfileData {
  nama_tokoh: string;
  ringkasan_hidup: string;
  peran_kunci: string[];
  sifat_dan_karakter: { sifat: string; penjelasan: string; ayat_pendukung: string; }[];
  ayat_penting: { ayat: string; konteks: string; }[];
}

interface CharacterProfileCardProps {
  data: ProfileData;
}

export const CharacterProfileCard: React.FC<CharacterProfileCardProps> = ({ data }) => {
  return (
    <Card className="w-full max-w-2xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{data.nama_tokoh}</h2>
      </div>

      <div className="prose max-w-none">
        <p className="text-lg">{data.ringkasan_hidup}</p>

        <div className="mt-6">
          <h3 className="font-bold text-xl flex items-center gap-2"><Star className="text-yellow-500" /> Peran Kunci</h3>
          <ul className="list-disc pl-5">
            {data.peran_kunci.map((peran, i) => <li key={i}>{peran}</li>)}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-xl flex items-center gap-2"><Key className="text-green-500" /> Sifat dan Karakter</h3>
          {data.sifat_dan_karakter.map((sifat, i) => (
            <div key={i} className="mt-2">
              <strong>{sifat.sifat}:</strong> {sifat.penjelasan} <em>({sifat.ayat_pendukung})</em>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-xl flex items-center gap-2"><Book className="text-purple-500" /> Ayat-ayat Penting</h3>
           {data.ayat_penting.map((ayat, i) => (
            <blockquote key={i} className="border-l-4 border-gray-300 pl-4 mt-2">
              <p><strong>{ayat.ayat}</strong>: {ayat.konteks}</p>
            </blockquote>
          ))}
        </div>
      </div>
    </Card>
  );
};
