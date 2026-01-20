# NusaVoice Backend

Indonesian Text-to-Speech API menggunakan [Piper TTS](https://github.com/rhasspy/piper).

## Development (Local)

### Prerequisites
- Python 3.10+
- Piper TTS binary

### Install Piper (Linux x86_64)
```bash
cd /tmp
wget https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_amd64.tar.gz
tar -xzf piper_amd64.tar.gz
sudo mv piper /opt/piper
sudo chmod +x /opt/piper/piper
export LD_LIBRARY_PATH=/opt/piper:$LD_LIBRARY_PATH
```

### Run Development Server
```bash
cd nusavoice-backend
pip install -r requirements.txt
export LD_LIBRARY_PATH=/opt/piper:$LD_LIBRARY_PATH
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Production Deployment (Oracle ARM VPS)

### Cara 1: Deploy dengan Docker (Recommended)

1. **Copy folder ke VPS:**
```bash
scp -r nusavoice-backend root@<VPS_IP>:~/n8n-stack/
```

2. **Tambahkan service ke `docker-compose.yml` di VPS:**
```yaml
  # NusaVoice TTS Backend
  nusavoice-backend:
    build:
      context: ./nusavoice-backend
      dockerfile: Dockerfile
    container_name: nusavoice-backend
    restart: unless-stopped
    env_file:
      - ./nusavoice-backend/.env.production
    volumes:
      - ./nusavoice-backend/output:/app/output
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nusavoice-backend.rule=Host(`nusavoice-backend.pradanayahya.com`)"
      - "traefik.http.routers.nusavoice-backend.entrypoints=websecure"
      - "traefik.http.routers.nusavoice-backend.tls.certresolver=le"
      - "traefik.http.services.nusavoice-backend.loadbalancer.server.port=8000"
```

3. **Build dan jalankan:**
```bash
cd ~/n8n-stack
docker compose build nusavoice-backend
docker compose up -d nusavoice-backend
```

4. **Test API:**
```bash
curl https://nusavoice-backend.pradanayahya.com/health
```

---

## API Endpoints

### Health Check
```
GET /health
```

### Generate TTS
```
POST /tts
Content-Type: application/json

{
  "voice": "male",        // "male" atau "female"
  "text": "Halo dunia",   // max 120 words, 800 chars
  "speed": 1.0,           // 0.8 - 1.2
  "format": "wav"
}
```

Response:
```json
{
  "request_id": "abc123",
  "audio_url": "/audio/abc123.wav",
  "voice": "male",
  "words": 2,
  "chars": 10,
  "duration_estimate_sec": 1.2
}
```

### Download Audio
```
GET /audio/{request_id}.wav
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NUVOICE_HOST` | 0.0.0.0 | Bind host |
| `NUVOICE_PORT` | 8000 | Bind port |
| `NUVOICE_MAX_WORDS` | 120 | Max words per request |
| `NUVOICE_MAX_CHARS` | 800 | Max chars per request |
| `NUVOICE_RATE_LIMIT_PER_HOUR` | 100 | Rate limit per IP |
| `NUVOICE_PIPER_BIN` | /opt/piper/piper | Piper binary path |
| `NUVOICE_MODEL_DIR` | ./models | Voice models directory |
| `NUVOICE_OUTPUT_DIR` | ./output | Audio output directory |
| `NUVOICE_AUDIO_TTL_HOURS` | 24 | Auto-delete audio after N hours |

---

## Voice Models

Models disimpan di `./models/{voice}/`:
- `models/male/model.onnx` + `model.onnx.json`
- `models/female/model.onnx` + `model.onnx.json`
