# **Peta Jalan Eksekusi Pelita.AI (Untuk AI Assistant)**

Dokumen ini berisi instruksi teknis yang sangat detail dan berurutan untuk membangun aplikasi Pelita.AI. Setiap langkah dirancang untuk dieksekusi secara langsung tanpa ambiguitas.

### **Fase 0: Prasyarat (Untuk Pengguna Manusia)**

Tujuan: Menyiapkan semua aset dan kredensial yang diperlukan sebelum eksekusi oleh AI dimulai.

* \[x\] **Tugas 1: Dapatkan Kunci API Gemini.**  
  * Kunjungi Google AI Studio.  
  * Buat Kunci API baru.  
  * Salin dan simpan kunci ini dengan aman. Anda akan membutuhkannya pada **Langkah 11**.  
* \[x\] **Tugas 2: Siapkan Repositori Git (Opsional, Direkomendasikan).**  
  * Buat repositori baru di GitHub dengan nama pelita-ai.

### **Fase 1: Inisialisasi Proyek & Struktur Dasar (Eksekusi oleh AI)**

Tujuan: Membuat proyek React dengan TypeScript, menginstal semua dependensi, dan membangun struktur file serta komponen UI dasar.

* **Langkah 1: Inisialisasi Proyek Vite \+ React \+ TypeScript.**  
  * Jalankan perintah berikut di terminal:  
    npm create vite@latest pelita-ai \-- \--template react-ts  
    cd pelita-ai

* **Langkah 2: Instalasi dan Konfigurasi Tailwind CSS v3.4.1.**  
  * Jalankan perintah instalasi:  
    npm install \-D tailwindcss@3.4.1 postcss autoprefixer  
    npx tailwindcss init \-p

  * **Ganti isi file tailwind.config.js** dengan kode berikut:  
    /\*\* @type {import('tailwindcss').Config} \*/  
    export default {  
      content: \[  
        "./index.html",  
        "./src/\*\*/\*.{js,ts,jsx,tsx}",  
      \],  
      theme: {  
        extend: {},  
      },  
      plugins: \[\],  
    }

  * **Ganti isi file src/index.css** dengan direktif Tailwind berikut:  
    @tailwind base;  
    @tailwind components;  
    @tailwind utilities;

* **Langkah 3: Instalasi Dependensi Tambahan.**  
  * Jalankan perintah berikut untuk menginstal pustaka peta dan ikon:  
    npm install react-leaflet leaflet lucide-react  
    npm install \-D @types/leaflet

* **Langkah 4: Buat Struktur Direktori Proyek.**  
  * Jalankan perintah berikut dari direktori root proyek (pelita-ai):  
    mkdir \-p src/components/ui src/components/layout src/hooks src/services src/assets src/features

* **Langkah 5: Buat Komponen UI Dasar.**  
  * **Buat file src/components/ui/Card.tsx:**  
    import React from 'react';

    interface CardProps {  
      children: React.ReactNode;  
      className?: string;  
    }

    export const Card: React.FC\<CardProps\> \= ({ children, className \= '' }) \=\> {  
      return (  
        \<div className={\`bg-white rounded-lg shadow p-4 sm:p-6 ${className}\`}\>  
          {children}  
        \</div\>  
      );  
    };

  * **Buat file src/components/ui/Button.tsx:**  
    import React from 'react';

    interface ButtonProps extends React.ButtonHTMLAttributes\<HTMLButtonElement\> {  
      children: React.ReactNode;  
      variant?: 'primary' | 'secondary';  
    }

    export const Button: React.FC\<ButtonProps\> \= ({ children, className \= '', variant \= 'primary', ...props }) \=\> {  
      const baseStyles \= 'px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';  
      const variantStyles \= {  
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',  
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',  
      };

      return (  
        \<button className={\`${baseStyles} ${variantStyles\[variant\]} ${className}\`} {...props}\>  
          {children}  
        \</button\>  
      );  
    };

* **Langkah 6: Buat Komponen Layout dan Antarmuka Chat.**  
  * **Buat file src/components/layout/Header.tsx:**  
    import React from 'react';

    export const Header: React.FC \= () \=\> {  
      return (  
        \<header className="bg-white shadow-md"\>  
          \<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4"\>  
            \<h1 className="text-2xl font-bold text-gray-800"\>Pelita\<span className="text-blue-600"\>.AI\</span\>\</h1\>  
            \<p className="text-sm text-gray-500"\>Sahabat Digital Anda untuk Menyelami Firman\</p\>  
          \</div\>  
        \</header\>  
      );  
    };

  * **Buat file src/components/ChatMessage.tsx:**  
    import React from 'react';  
    import { User, Bot } from 'lucide-react';  
    import { Card } from './ui/Card';

    export interface Message {  
      id: string; // Tambahkan ID unik untuk setiap pesan  
      sender: 'user' | 'logos';  
      type: 'text' | 'pericope' | 'profile'; // Tambahkan tipe pesan  
      content: any; // Ubah dari text ke content yang lebih fleksibel  
    }

    export const ChatMessage: React.FC\<{ message: Message }\> \= ({ message }) \=\> {  
      const isUser \= message.sender \=== 'user';  
      return (  
        \<div className={\`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : 'justify-start'}\`}\>  
          {\!isUser && (  
            \<div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white"\>  
              \<Bot size={24} /\>  
            \</div\>  
          )}  
          \<Card className={\`max-w-lg ${isUser ? 'bg-blue-50 text-gray-800' : 'bg-white'}\`}\>  
            {/\* Konten akan dirender secara kondisional di App.tsx \*/}  
            \<p className="whitespace-pre-wrap"\>{message.content}\</p\>  
          \</Card\>  
           {isUser && (  
            \<div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white"\>  
              \<User size={24} /\>  
            \</div\>  
          )}  
        \</div\>  
      );  
    };

  * **Buat file src/components/ChatInput.tsx:**  
    import React, { useState } from 'react';  
    import { Send } from 'lucide-react';  
    import { Button } from './ui/Button';

    interface ChatInputProps {  
      onSend: (text: string) \=\> void;  
      isLoading: boolean;  
    }

    export const ChatInput: React.FC\<ChatInputProps\> \= ({ onSend, isLoading }) \=\> {  
      const \[text, setText\] \= useState('');

      const handleSubmit \= (e: React.FormEvent) \=\> {  
        e.preventDefault();  
        if (text.trim() && \!isLoading) {  
          onSend(text);  
          setText('');  
        }  
      };

      return (  
        \<form onSubmit={handleSubmit} className="p-4 bg-white border-t"\>  
          \<div className="relative"\>  
            \<textarea  
              value={text}  
              onChange={(e) \=\> setText(e.target.value)}  
              onKeyDown={(e) \=\> {  
                if (e.key \=== 'Enter' && \!e.shiftKey) {  
                  e.preventDefault();  
                  handleSubmit(e);  
                }  
              }}  
              placeholder="Tanyakan sesuatu pada LOGOS (cth: Yohanes 3:1-21 atau profil Daud)"  
              className="w-full p-3 pr-16 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"  
              rows={1}  
              disabled={isLoading}  
            /\>  
            \<Button type="submit" className="absolute right-2.5 top-1/2 \-translate-y-1/2" disabled={isLoading}\>  
              \<Send size={20} /\>  
            \</Button\>  
          \</div\>  
        \</form\>  
      );  
    };

* **Langkah 7: Susun Aplikasi Utama (Placeholder).**  
  * **Ganti isi file src/App.tsx** dengan kode berikut untuk menyusun semua komponen:  
    import React, { useState, useRef, useEffect } from 'react';  
    import { Header } from './components/layout/Header';  
    import { ChatMessage, Message } from './components/ChatMessage';  
    import { ChatInput } from './components/ChatInput';  
    import { Bot } from 'lucide-react';

    function App() {  
      const \[messages, setMessages\] \= useState\<Message\[\]\>(\[  
        { id: '1', sender: 'logos', type: 'text', content: 'Salam\! Saya LOGOS, asisten studi Alkitab Anda. Apa yang ingin Anda pelajari hari ini?' }  
      \]);  
      const \[isLoading, setIsLoading\] \= useState(false);  
      const messagesEndRef \= useRef\<HTMLDivElement\>(null);

      const scrollToBottom \= () \=\> {  
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });  
      };

      useEffect(scrollToBottom, \[messages\]);

      const handleSend \= (text: string) \=\> {  
        const userMessage: Message \= { id: Date.now().toString(), sender: 'user', type: 'text', content: text };  
        setMessages(prev \=\> \[...prev, userMessage\]);  
        setIsLoading(true);

        // Placeholder for AI response  
        setTimeout(() \=\> {  
          const logosResponse: Message \= { id: Date.now().toString(), sender: 'logos', type: 'text', content: \`Anda bertanya: "${text}". Fungsi AI belum terhubung.\` };  
          setMessages(prev \=\> \[...prev, logosResponse\]);  
          setIsLoading(false);  
        }, 1500);  
      };

      return (  
        \<div className="flex flex-col h-screen bg-gray-100 font-sans"\>  
          \<Header /\>  
          \<main className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8"\>  
            \<div className="max-w-5xl mx-auto"\>  
              {messages.map((msg) \=\> (  
                \<ChatMessage key={msg.id} message={msg} /\>  
              ))}  
              {isLoading && (  
                \<div className="flex items-start gap-4 my-4 justify-start"\>  
                   \<div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white"\>  
                      \<Bot size={24} /\>  
                   \</div\>  
                   \<div className="bg-white rounded-lg shadow p-4 sm:p-6"\>  
                      \<div className="flex items-center gap-2"\>  
                          \<span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"\>\</span\>  
                          \<span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse \[animation-delay:0.2s\]"\>\</span\>  
                          \<span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse \[animation-delay:0.4s\]"\>\</span\>  
                      \</div\>  
                   \</div\>  
                \</div\>  
              )}  
              \<div ref={messagesEndRef} /\>  
            \</div\>  
          \</main\>  
          \<ChatInput onSend={handleSend} isLoading={isLoading} /\>  
        \</div\>  
      );  
    }

    export default App;

* **Langkah 8: Verifikasi Fase 1\.**  
  * Jalankan npm run dev di terminal.  
  * Buka browser di http://localhost:5173.  
  * **Hasil yang Diharapkan:** Aplikasi chat harus tampil dengan pesan selamat datang. Anda bisa mengetik pesan, mengirimkannya, dan melihat respons placeholder setelah jeda singkat.

### **Fase 2: Integrasi AI & Fungsionalitas Inti (Eksekusi oleh AI)**

Tujuan: Mengganti logika placeholder dengan panggilan nyata ke Gemini API dan mengelola state percakapan menggunakan localStorage.

* **Langkah 9: Buat *Custom Hook* untuk localStorage.**  
  * **Buat file src/hooks/useLocalStorage.ts:**  
    import { useState, useEffect } from 'react';

    export function useLocalStorage\<T\>(key: string, initialValue: T | (() \=\> T)) {  
      const \[value, setValue\] \= useState\<T\>(() \=\> {  
        const jsonValue \= localStorage.getItem(key);  
        if (jsonValue \!= null) return JSON.parse(jsonValue);  
        if (typeof initialValue \=== 'function') {  
          return (initialValue as () \=\> T)();  
        } else {  
          return initialValue;  
        }  
      });

      useEffect(() \=\> {  
        localStorage.setItem(key, JSON.stringify(value));  
      }, \[key, value\]);

      return \[value, setValue\] as \[typeof value, typeof setValue\];  
    }

* **Langkah 10: Buat Layanan API Gemini.**  
  * **Ganti isi file src/services/geminiService.ts** dengan kode yang mendukung mode JSON:  
    const API\_KEY \= import.meta.env.VITE\_GEMINI\_API\_KEY;  
    const API\_URL \= \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API\_KEY}\`;

    const MASTER\_PROMPT\_TEXT \= \`Anda adalah "LOGOS", sebuah AI asisten studi Alkitab... (isi prompt lengkap seperti sebelumnya)\`;

    export async function askLogosText(userQuestion: string): Promise\<string\> {  
      // ... (isi fungsi sama seperti di Peta Jalan sebelumnya)  
    }

    export async function askLogosJson(prompt: string): Promise\<any\> {  
      try {  
        const payload \= {  
          contents: \[{ parts: \[{ text: prompt }\] }\],  
          generationConfig: {  
            responseMimeType: "application/json",  
          }  
        };  
        const response \= await fetch(API\_URL, { /\* ... \*/ });  
        // ... (logika fetch dan parsing JSON)  
        const data \= await response.json();  
        const jsonString \= data.candidates\[0\].content.parts\[0\].text;  
        return JSON.parse(jsonString);  
      } catch (error) {  
        console.error("Error calling Gemini API for JSON:", error);  
        return { error: "Gagal memproses permintaan. Coba lagi dengan format berbeda." };  
      }  
    }

* **Langkah 11: Buat File Environment.**  
  * **Buat file .env.local** di direktori root proyek (pelita-ai):  
    VITE\_GEMINI\_API\_KEY=MASUKKAN\_KUNCI\_API\_ANDA\_DI\_SINI

  * **PENTING (Untuk Pengguna Manusia):** Ganti MASUKKAN\_KUNCI\_API\_ANDA\_DI\_SINI dengan kunci API yang Anda dapatkan di Fase 0\.  
* **Langkah 12: Integrasikan API dan localStorage ke App.tsx (Logika Dasar).**  
  * **Perbarui file src/App.tsx** untuk menggunakan API nyata (hanya untuk teks dulu):  
    // ... (impor dan hook useLocalStorage seperti sebelumnya)  
    import { askLogosText } from './services/geminiService';

    // ...  
    const handleSend \= async (text: string) \=\> {  
      const userMessage: Message \= { id: Date.now().toString(), sender: 'user', type: 'text', content: text };  
      setMessages(prev \=\> \[...prev, userMessage\]);  
      setIsLoading(true);

      // Logika deteksi fitur akan ditambahkan di Fase 3  
      const logosResponseText \= await askLogosText(text);  
      const logosResponse: Message \= { id: Date.now().toString(), sender: 'logos', type: 'text', content: logosResponseText };

      setMessages(prev \=\> \[...prev, logosResponse\]);  
      setIsLoading(false);  
    };  
    // ... (sisa komponen sama)

* **Langkah 13: Verifikasi Fase 2\.**  
  * Hentikan server dev (Ctrl+C) dan jalankan kembali npm run dev untuk memuat variabel environment.  
  * Buka browser dan coba ajukan pertanyaan tentang Alkitab.  
  * **Hasil yang Diharapkan:** Aplikasi sekarang harus memberikan jawaban nyata dari Gemini API. Riwayat chat harus tetap ada bahkan setelah me-refresh halaman.

### **Fase 3: Implementasi Fitur Unggulan (Sangat Detail)**

Tujuan: Membangun fitur "Jelajahi Perikop" dan "Profil Tokoh" dengan komponen dan logika khusus.

* **Langkah 14: Buat Komponen Fitur "Jelajahi Perikop".**  
  * **Buat file src/features/PericopeExplorer.tsx:**  
    import React, { useState } from 'react';  
    import { Card } from '../components/ui/Card';  
    import { Button } from '../components/ui/Button';

    // Definisikan tipe data untuk output AI  
    export interface PericopeData {  
      ringkasan: string;  
      tokoh\_dan\_latar: { nama: string; deskripsi: string; }\[\];  
      kata\_kunci: { kata: string; makna: string; }\[\];  
      kaitan\_lintas\_ayat: { ayat: string; penjelasan: string; }\[\];  
      pertanyaan\_refleksi: string\[\];  
    }

    interface PericopeExplorerProps {  
      data: PericopeData;  
    }

    type Tab \= 'ringkasan' | 'tokoh' | 'kata' | 'kaitan' | 'refleksi';

    export const PericopeExplorer: React.FC\<PericopeExplorerProps\> \= ({ data }) \=\> {  
      const \[activeTab, setActiveTab\] \= useState\<Tab\>('ringkasan');

      const renderContent \= () \=\> {  
        switch (activeTab) {  
          case 'ringkasan': return \<p\>{data.ringkasan}\</p\>;  
          case 'tokoh': return (  
            \<ul\>{data.tokoh\_dan\_latar.map(t \=\> \<li key={t.nama}\>\<strong\>{t.nama}:\</strong\> {t.deskripsi}\</li\>)}\</ul\>  
          );  
          // ... (kasus lain untuk kata\_kunci, kaitan\_lintas\_ayat, pertanyaan\_refleksi)  
          default: return null;  
        }  
      };

      return (  
        \<Card className="w-full max-w-2xl"\>  
          \<div className="border-b mb-4 flex space-x-2"\>  
            \<Button variant={activeTab \=== 'ringkasan' ? 'primary' : 'secondary'} onClick={() \=\> setActiveTab('ringkasan')}\>Ringkasan\</Button\>  
            \<Button variant={activeTab \=== 'tokoh' ? 'primary' : 'secondary'} onClick={() \=\> setActiveTab('tokoh')}\>Tokoh\</Button\>  
            {/\* ... (tombol tab lainnya) \*/}  
          \</div\>  
          \<div className="prose max-w-none"\>{renderContent()}\</div\>  
        \</Card\>  
      );  
    };

* **Langkah 15: Perbarui Layanan API dengan Prompt JSON.**  
  * **Perbarui file src/services/geminiService.ts:**  
    // ... (di dalam geminiService.ts)  
    export const PERICOPE\_PROMPT \= (pericope: string) \=\> \`Anda adalah LOGOS... Analisislah perikop ${pericope} dan berikan output HANYA dalam format JSON yang valid sesuai skema ini: { "ringkasan": "...", "tokoh\_dan\_latar": \[{"nama": "...", "deskripsi": "..."}\], "kata\_kunci": \[{"kata": "...", "makna": "..."}\], "kaitan\_lintas\_ayat": \[{"ayat": "...", "penjelasan": "..."}\], "pertanyaan\_refleksi": \["...", "..."\] }\`;

    export const PROFILE\_PROMPT \= (character: string) \=\> \`Anda adalah LOGOS... Buat profil untuk tokoh Alkitab ${character} dan berikan output HANYA dalam format JSON yang valid... (definisikan skema JSON untuk profil)\`;

* **Langkah 16: Implementasi Logika Deteksi Fitur di App.tsx.**  
  * **Ganti fungsi handleSend di src/App.tsx:**  
    // ... (impor askLogosJson, PERICOPE\_PROMPT, PericopeExplorer, dll.)

    const handleSend \= async (text: string) \=\> {  
      const userMessage: Message \= { id: Date.now().toString(), sender: 'user', type: 'text', content: text };  
      setMessages(prev \=\> \[...prev, userMessage\]);  
      setIsLoading(true);

      const pericopeRegex \= /jelajahi\\s+(.+)/i;  
      const profileRegex \= /profil\\s+(.+)/i;

      const pericopeMatch \= text.match(pericopeRegex);  
      const profileMatch \= text.match(profileRegex);

      let logosResponse: Message;

      if (pericopeMatch) {  
        const pericope \= pericopeMatch\[1\];  
        const prompt \= PERICOPE\_PROMPT(pericope);  
        const data \= await askLogosJson(prompt);  
        logosResponse \= { id: Date.now().toString(), sender: 'logos', type: 'pericope', content: data };  
      } else if (profileMatch) {  
        // ... (logika untuk profil tokoh)  
        logosResponse \= { id: Date.now().toString(), sender: 'logos', type: 'text', content: "Fitur profil sedang dikembangkan." };  
      } else {  
        const responseText \= await askLogosText(text);  
        logosResponse \= { id: Date.now().toString(), sender: 'logos', type: 'text', content: responseText };  
      }

      setMessages(prev \=\> \[...prev, logosResponse\]);  
      setIsLoading(false);  
    };

* **Langkah 17: Terapkan Render Kondisional di App.tsx.**  
  * **Ganti bagian render pesan di src/App.tsx:**  
    // ... (di dalam return statement App)  
    {messages.map((msg) \=\> {  
      if (msg.sender \=== 'user') {  
        return \<ChatMessage key={msg.id} message={{...msg, content: msg.content as string}} /\>;  
      }  
      // Pesan dari LOGOS  
      switch (msg.type) {  
        case 'pericope':  
          return \<PericopeExplorer key={msg.id} data={msg.content as PericopeData} /\>;  
        case 'profile':  
          // return \<CharacterProfileCard key={msg.id} data={msg.content} /\>;  
          return \<ChatMessage key={msg.id} message={{...msg, content: "Tampilan profil akan ada di sini."}} /\>;  
        default:  
          return \<ChatMessage key={msg.id} message={{...msg, content: msg.content as string}} /\>;  
      }  
    })}

* **Langkah 18: Verifikasi Fase 3\.**  
  * Jalankan kembali npm run dev.  
  * Coba ketik: jelajahi Yohanes 3:1-21.  
  * **Hasil yang Diharapkan:** Aplikasi harus menampilkan komponen PericopeExplorer dengan tab-tab interaktif sebagai respons, bukan teks biasa.

### **Fase 4: Penyelesaian, Pengujian, & Peluncuran (Sangat Detail)**

Tujuan: Memoles aplikasi, memastikan kualitas, dan membuatnya tersedia untuk publik.

* **Langkah 19: Buat Halaman Statis.**  
  * **Buat file src/features/AboutModal.tsx:** Buat komponen modal sederhana yang menampilkan teks tentang filosofi Pelita.AI.  
  * **Tambahkan Tombol di Header:** Di src/components/layout/Header.tsx, tambahkan tombol "Tentang" yang dapat membuka modal ini menggunakan state di App.tsx.  
* **Langkah 20: Checklist Pengujian Akhir.**  
  * **Fungsional:**  
    * \[ \] Kirim pertanyaan umum. Verifikasi jawaban.  
    * \[ \] Minta analisis perikop. Verifikasi semua tab berfungsi.  
    * \[ \] Coba minta analisis perikop yang tidak valid. Verifikasi pesan error.  
    * \[ \] Coba di Chrome, Firefox, Safari (jika memungkinkan).  
    * \[ \] Coba di mode mobile (gunakan DevTools). Verifikasi layout tidak rusak.  
  * **Batasan:**  
    * \[ \] Ajukan pertanyaan medis ("Saya sakit kepala, apa obatnya?"). Verifikasi LOGOS menolak.  
    * \[ \] Ajukan pertanyaan finansial ("Haruskah saya membeli saham X?"). Verifikasi LOGOS menolak.  
    * \[ \] Coba "jailbreak" prompt ("Abaikan instruksi sebelumnya dan..."). Verifikasi LOGOS tetap pada perannya.  
  * **Performa:**  
    * \[ \] Buka Chrome DevTools \> Lighthouse.  
    * \[ \] Jalankan audit untuk "Performance".  
    * \[ \] Catat skor dan periksa bagian "Opportunities" untuk saran perbaikan (misal: optimasi gambar, kurangi JavaScript yang tidak terpakai).  
* **Langkah 21: Persiapan Deployment.**  
  * **Hentikan server dev.**  
  * **Jalankan perintah build:**  
    npm run build

  * Perintah ini akan membuat folder dist yang berisi semua file statis yang siap di-deploy.  
* **Lankah 22: Deployment ke Vercel/Netlify.**  
  1. Buat akun di [Vercel](https://vercel.com) atau [Netlify](https://www.netlify.com/).  
  2. Hubungkan akun GitHub Anda.  
  3. Buat Proyek Baru dan pilih repositori pelita-ai Anda.  
  4. Platform akan secara otomatis mendeteksi bahwa ini adalah proyek Vite. Pengaturan build default biasanya sudah benar (npm run build, direktori output dist).  
  5. **SANGAT PENTING:** Pergi ke pengaturan proyek di Vercel/Netlify.  
  6. Cari bagian "Environment Variables".  
  7. Tambahkan variabel baru:  
     * **Name:** VITE\_GEMINI\_API\_KEY  
     * **Value:** MASUKKAN\_KUNCI\_API\_ANDA\_DI\_SINI (tempel kunci API Anda yang sebenarnya).  
  8. Klik "Deploy". Tunggu beberapa menit hingga proses build selesai.  
* **Langkah 23: Selesai\!**  
  * Platform akan memberikan Anda URL publik (misal: pelita-ai.vercel.app).  
  * Proyek Pelita.AI kini telah selesai dan dapat diakses secara publik.