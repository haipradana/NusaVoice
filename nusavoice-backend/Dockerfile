# NusaVoice Backend - ARM64 Dockerfile
# For Oracle Cloud (Ampere A1)

FROM python:3.10-slim

WORKDIR /app

# Install dependencies for Piper
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    libespeak-ng1 \
    && rm -rf /var/lib/apt/lists/*

# Download and install Piper ARM64
RUN wget -q https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_arm64.tar.gz -O /tmp/piper.tar.gz \
    && tar -xzf /tmp/piper.tar.gz -C /opt \
    && chmod +x /opt/piper/piper \
    && rm /tmp/piper.tar.gz

# Set LD_LIBRARY_PATH for Piper libraries
ENV LD_LIBRARY_PATH=/opt/piper:$LD_LIBRARY_PATH

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/
COPY models/ ./models/

# Create output directory
RUN mkdir -p ./output

# Environment defaults (override via docker-compose or .env)
ENV NUVOICE_HOST=0.0.0.0
ENV NUVOICE_PORT=8000
ENV NUVOICE_PIPER_BIN=/opt/piper/piper
ENV NUVOICE_MODEL_DIR=./models
ENV NUVOICE_OUTPUT_DIR=./output

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
