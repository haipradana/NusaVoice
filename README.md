# NusaVoice 🇮🇩🗣️

**A lightweight Indonesian Text-to-Speech model** fine-tuned for Bahasa Indonesia. Runs on **CPU-only** with fast real-time inference.

Built on [Piper TTS](https://github.com/rhasspy/piper) architecture using VITS (Variational Inference with adversarial learning for end-to-end Text-to-Speech).

## Model Details

| Voice | Training Data | Architecture |
|-------|---------------|--------------|
| **Male** | Audiobook & Podcast recordings | Piper VITS |
| **Female** | Audiobook recordings | Piper VITS |

Both models are custom fine-tuned from Piper's base architecture, optimized for natural Indonesian speech patterns and pronunciation.

> **Training notebook coming soon**


## Project Structure

```
NusaVoice/
├── nusavoice-frontend/    # React + Vite + Tailwind
└── nusavoice-backend/     # FastAPI + Piper TTS
```