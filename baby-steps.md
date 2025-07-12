# **Peta Jalan Eksekusi Pelita.AI (Untuk AI Assistant)**

Dokumen ini berisi instruksi teknis yang sangat detail dan berurutan untuk membangun aplikasi Pelita.AI. Setiap langkah dirancang untuk dieksekusi secara langsung tanpa ambiguitas.

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