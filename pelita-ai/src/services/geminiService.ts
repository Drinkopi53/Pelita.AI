const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// --- PROMPTS ---
const MASTER_PROMPT = `Anda adalah "LOGOS", sebuah AI asisten studi Alkitab yang berpengetahuan, rendah hati, dan netral secara teologis. Tujuan Anda adalah membantu pengguna memahami isi Alkitab (berdasarkan terjemahan Lembaga Alkitab Indonesia: Terjemahan Baru). JANGAN memberikan opini pribadi, doktrin spesifik satu denominasi, atau nasihat di luar Alkitab (medis, finansial, dll). Selalu dasarkan jawaban Anda pada ayat dan konteks sejarah-budaya yang relevan. Selalu sertakan referensi ayat. Mulai jawaban Anda dengan nada yang sopan, informatif, dan membimbing.`;

export const PERICOPE_PROMPT = (pericope: string) => `
  ${MASTER_PROMPT}
  Fokus utama Anda saat ini adalah menganalisis perikop Alkitab.
  Analisislah perikop ${pericope} dan berikan output HANYA dalam format JSON yang valid dan dapat di-parse.
  Struktur JSON harus mengikuti skema ini:
  {
    "ringkasan": "string",
    "tokoh_dan_latar": [{ "nama": "string", "deskripsi": "string" }],
    "kata_kunci": [{ "kata": "string", "makna": "string" }],
    "kaitan_lintas_ayat": [{ "ayat": "string", "penjelasan": "string" }],
    "pertanyaan_refleksi": ["string", "string"]
  }
`;

export const PROFILE_PROMPT = (character: string) => `
  ${MASTER_PROMPT}
  Fokus utama Anda saat ini adalah membuat profil tokoh Alkitab.
  Buat profil untuk tokoh Alkitab ${character} dan berikan output HANYA dalam format JSON yang valid.
  Struktur JSON harus mengikuti skema ini:
  {
    "nama_tokoh": "string",
    "ringkasan_hidup": "string",
    "peran_kunci": ["string", "string"],
    "sifat_dan_karakter": [{ "sifat": "string", "penjelasan": "string", "ayat_pendukung": "string" }],
    "ayat_penting": [{ "ayat": "string", "konteks": "string" }]
  }
`;

// --- API FUNCTIONS ---

async function callGemini(prompt: string, responseFormat: 'text' | 'json_object' = 'text') {
  try {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: responseFormat === 'json_object' ? "application/json" : "text/plain",
      }
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error:", errorBody);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response structure:", data);
      throw new Error("Struktur data tidak sesuai.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function askLogosText(userQuestion: string): Promise<string> {
  const prompt = `${MASTER_PROMPT}\n\nSekarang, jawablah pertanyaan pengguna berikut dengan saksama:\n"${userQuestion}"`;
  try {
    return await callGemini(prompt, 'text');
  } catch (error) {
    return "Maaf, terjadi kendala teknis saat menghubungi LOGOS. Silakan periksa koneksi Anda dan coba lagi.";
  }
}

export async function askLogosJson<T>(prompt: string): Promise<T> {
  try {
    const jsonString = await callGemini(prompt, 'json_object');
    // Clean the response from markdown code block
    const cleanedJsonString = jsonString.replace(/```json\n?|```/g, '');
    return JSON.parse(cleanedJsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON from LOGOS:", error);
    // You might want to return a specific error structure or re-throw
    throw new Error("Gagal mem-parsing respons JSON dari LOGOS.");
  }
}
