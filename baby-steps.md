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
    mkdir \-p src/components/ui src/components/layout src/hooks src/services src/assets

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
      sender: 'user' | 'logos';  
      text: string;  
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
            \<p className="whitespace-pre-wrap"\>{message.text}\</p\>  
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
              placeholder="Tanyakan sesuatu pada LOGOS..."  
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

* **Langkah 7: Susun Aplikasi Utama.**  
  * **Ganti isi file src/App.tsx** dengan kode berikut untuk menyusun semua komponen:  
    import React, { useState, useRef, useEffect } from 'react';  
    import { Header } from './components/layout/Header';  
    import { ChatMessage, Message } from './components/ChatMessage';  
    import { ChatInput } from './components/ChatInput';  
    import { Bot } from 'lucide-react';

    function App() {  
      const \[messages, setMessages\] \= useState\<Message\[\]\>(\[  
        { sender: 'logos', text: 'Salam\! Saya LOGOS, asisten studi Alkitab Anda. Apa yang ingin Anda pelajari hari ini?' }  
      \]);  
      const \[isLoading, setIsLoading\] \= useState(false);  
      const messagesEndRef \= useRef\<HTMLDivElement\>(null);

      const scrollToBottom \= () \=\> {  
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });  
      };

      useEffect(scrollToBottom, \[messages\]);

      const handleSend \= (text: string) \=\> {  
        const userMessage: Message \= { sender: 'user', text };  
        setMessages(prev \=\> \[...prev, userMessage\]);  
        setIsLoading(true);

        // Placeholder for AI response  
        setTimeout(() \=\> {  
          const logosResponse: Message \= { sender: 'logos', text: \`Anda bertanya: "${text}". Fungsi AI belum terhubung.\` };  
          setMessages(prev \=\> \[...prev, logosResponse\]);  
          setIsLoading(false);  
        }, 1500);  
      };

      return (  
        \<div className="flex flex-col h-screen bg-gray-100 font-sans"\>  
          \<Header /\>  
          \<main className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8"\>  
            \<div className="max-w-5xl mx-auto"\>  
              {messages.map((msg, index) \=\> (  
                \<ChatMessage key={index} message={msg} /\>  
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
  * **Buat file src/services/geminiService.ts:**  
    const API\_KEY \= import.meta.env.VITE\_GEMINI\_API\_KEY;  
    const API\_URL \= \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API\_KEY}\`;

    const MASTER\_PROMPT \= \`Anda adalah "LOGOS", sebuah AI asisten studi Alkitab yang berpengetahuan, rendah hati, dan netral secara teologis. Tujuan Anda adalah membantu pengguna memahami isi Alkitab (berdasarkan terjemahan Lembaga Alkitab Indonesia: Terjemahan Baru). JANGAN memberikan opini pribadi, doktrin spesifik satu denominasi, atau nasihat di luar Alkitab (medis, finansial, dll). Selalu dasarkan jawaban Anda pada ayat dan konteks sejarah-budaya yang relevan. Selalu sertakan referensi ayat. Mulai jawaban Anda dengan nada yang sopan, informatif, dan membimbing. Sekarang, jawablah pertanyaan pengguna berikut dengan saksama:\`;

    export async function askLogos(userQuestion: string): Promise\<string\> {  
      try {  
        const payload \= {  
          contents: \[{  
            parts: \[{ text: \`${MASTER\_PROMPT}\\n\\n"${userQuestion}"\` }\]  
          }\]  
        };

        const response \= await fetch(API\_URL, {  
          method: 'POST',  
          headers: { 'Content-Type': 'application/json' },  
          body: JSON.stringify(payload)  
        });

        if (\!response.ok) {  
          const errorBody \= await response.json();  
          console.error("API Error:", errorBody);  
          throw new Error(\`API request failed with status ${response.status}\`);  
        }

        const data \= await response.json();

        if (data.candidates && data.candidates.length \> 0\) {  
          return data.candidates\[0\].content.parts\[0\].text;  
        } else {  
          return "Maaf, saya tidak dapat menghasilkan respons saat ini.";  
        }

      } catch (error) {  
        console.error("Error calling Gemini API:", error);  
        return "Maaf, terjadi kendala teknis saat menghubungi LOGOS. Silakan periksa koneksi Anda dan coba lagi.";  
      }  
    }

* **Langkah 11: Buat File Environment.**  
  * **Buat file .env.local** di direktori root proyek (pelita-ai):  
    VITE\_GEMINI\_API\_KEY=MASUKKAN\_KUNCI\_API\_ANDA\_DI\_SINI

  * **PENTING (Untuk Pengguna Manusia):** Ganti MASUKKAN\_KUNCI\_API\_ANDA\_DI\_SINI dengan kunci API yang Anda dapatkan di Fase 0\.  
* **Langkah 12: Integrasikan API dan localStorage ke App.tsx.**  
  * **Perbarui file src/App.tsx** dengan kode berikut:  
    import React, { useState, useRef, useEffect } from 'react';  
    import { Header } from './components/layout/Header';  
    import { ChatMessage, Message } from './components/ChatMessage';  
    import { ChatInput } from './components/ChatInput';  
    import { Bot } from 'lucide-react';  
    import { useLocalStorage } from './hooks/useLocalStorage';  
    import { askLogos } from './services/geminiService';

    function App() {  
      const \[messages, setMessages\] \= useLocalStorage\<Message\[\]\>('pelita-ai-messages', \[  
        { sender: 'logos', text: 'Salam\! Saya LOGOS, asisten studi Alkitab Anda. Apa yang ingin Anda pelajari hari ini?' }  
      \]);  
      const \[isLoading, setIsLoading\] \= useState(false);  
      const messagesEndRef \= useRef\<HTMLDivElement\>(null);

      const scrollToBottom \= () \=\> {  
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });  
      };

      useEffect(scrollToBottom, \[messages\]);

      const handleSend \= async (text: string) \=\> {  
        const userMessage: Message \= { sender: 'user', text };  
        setMessages(prev \=\> \[...prev, userMessage\]);  
        setIsLoading(true);

        const logosResponseText \= await askLogos(text);  
        const logosResponse: Message \= { sender: 'logos', text: logosResponseText };

        setMessages(prev \=\> \[...prev, logosResponse\]);  
        setIsLoading(false);  
      };

      return (  
        \<div className="flex flex-col h-screen bg-gray-100 font-sans"\>  
          \<Header /\>  
          \<main className="flex-1 overflow-y-auto p-4 sm:px-6 lg:px-8"\>  
            \<div className="max-w-5xl mx-auto"\>  
              {messages.map((msg, index) \=\> (  
                \<ChatMessage key={index} message={msg} /\>  
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

* **Langkah 13: Verifikasi Fase 2\.**  
  * Hentikan server dev (Ctrl+C) dan jalankan kembali npm run dev untuk memuat variabel environment.  
  * Buka browser dan coba ajukan pertanyaan tentang Alkitab.  
  * **Hasil yang Diharapkan:** Aplikasi sekarang harus memberikan jawaban nyata dari Gemini API. Riwayat chat harus tetap ada bahkan setelah me-refresh halaman.

### **Fase 3 & 4: Fitur Unggulan, Penyelesaian & Peluncuran**

Tujuan: Mengimplementasikan fitur-fitur canggih, melakukan pengujian akhir, dan men-deploy aplikasi. Langkah-langkah ini lebih kompleks dan mungkin memerlukan iterasi.

* **Langkah 14: Implementasi Fitur "Jelajahi Perikop" & "Profil Tokoh".**  
  * Ini melibatkan pembuatan komponen baru (PericopeExplorer.tsx, CharacterProfileCard.tsx).  
  * Logika di handleSend (App.tsx) perlu diperbarui untuk mendeteksi pola input (misalnya, Yohanes 3:16 atau profil Daud) dan memanggil askLogos dengan prompt yang meminta output JSON.  
  * Render komponen khusus ini sebagai ganti ChatMessage biasa saat respons JSON diterima.  
* **Langkah 15: Implementasi Visualisasi Peta.**  
  * Buat komponen InteractiveMap.tsx menggunakan react-leaflet.  
  * Komponen ini akan menerima data lokasi (koordinat) sebagai props dan merendernya.  
* **Langkah 16: Pengujian Akhir.**  
  * **Pengujian Fungsional:** Verifikasi semua fitur di Chrome, Firefox, dan Safari (mode desktop & mobile).  
  * **Pengujian Batasan:** Ajukan pertanyaan di luar topik (medis, finansial) untuk memastikan LOGOS menolak dengan sopan.  
  * **Pengujian Performa:** Gunakan Lighthouse di Chrome DevTools untuk memeriksa kecepatan muat dan responsivitas.  
* **Langkah 17: Deployment.**  
  * Jalankan npm run build.  
  * Deploy folder dist ke platform hosting statis seperti Vercel atau Netlify.  
  * **PENTING (Untuk Pengguna Manusia):** Konfigurasikan *Environment Variable* VITE\_GEMINI\_API\_KEY di pengaturan platform hosting Anda.  
* **Langkah 18: Selesai\!**  
  * Proyek Pelita.AI kini telah selesai dan dapat diakses secara publik.