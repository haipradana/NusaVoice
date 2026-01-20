export interface TTSPayload {
  voice: 'female' | 'male';
  text: string;
  speed: number;
  format: 'wav' | 'mp3';
}

export interface TTSResponse {
  audio_url: string;
  duration?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nusavoice-backend.pradanayahya.com';

export async function generateTTS(payload: TTSPayload): Promise<TTSResponse> {
  const response = await fetch(`${API_BASE_URL}/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to generate audio' }));
    throw new Error(error.detail || 'Failed to generate audio');
  }

  const data = await response.json();
  return {
    audio_url: `${API_BASE_URL}${data.audio_url}`,
    duration: data.duration_estimate_sec,
  };
}

export { API_BASE_URL };

