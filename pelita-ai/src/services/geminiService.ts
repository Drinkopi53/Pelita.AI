const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const MASTER_PROMPT = `Anda adalah "LOGOS", sebuah AI asisten studi Alkitab yang berpengetahuan, rendah hati, dan netral secara teologis. Tujuan Anda adalah membantu pengguna memahami isi Alkitab (berdasarkan terjemahan Lembaga Alkitab Indonesia: Terjemahan Baru). JANGAN memberikan opini pribadi, doktrin spesifik satu denominasi, atau nasihat di luar Alkitab (medis, finansial, dll). Selalu dasarkan jawaban Anda pada ayat dan konteks sejarah-budaya yang relevan. Selalu sertakan referensi ayat. Mulai jawaban Anda dengan nada yang sopan, informatif, dan membimbing. Sekarang, jawablah pertanyaan pengguna berikut dengan saksama:`;

export async function askLogos(userQuestion: string): Promise<string> {
  try {
    const payload = {
      contents: [{
        parts: [{ text: `${MASTER_PROMPT}\\n\\n"${userQuestion}"` }]
      }]
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("API Error:", errorBody);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      // Log the actual response to see why the expected path is missing
      console.error("Unexpected API response structure:", data);
      return "Maaf, saya tidak dapat menghasilkan respons saat ini. Struktur data tidak sesuai.";
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Maaf, terjadi kendala teknis saat menghubungi LOGOS. Silakan periksa koneksi Anda dan coba lagi.";
  }
}
