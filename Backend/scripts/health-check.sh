#!/bin/bash
# health-check.sh — Comprueba que el backend está activo.
# Si no responde, envía alerta por Telegram.
# Uso en crontab: */5 * * * * /root/portafolio/Backend/scripts/health-check.sh

HEALTH_URL="http://localhost:3001/api/health"
BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
CHAT_ID="${TELEGRAM_CHAT_ID}"
FLAG_FILE="/tmp/portfolio_down.flag"

send_telegram() {
  curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -H "Content-Type: application/json" \
    -d "{\"chat_id\":\"${CHAT_ID}\",\"text\":\"$1\",\"parse_mode\":\"HTML\"}" \
    > /dev/null
}

# Cargar .env si existe
if [ -f /root/portafolio/.env ]; then
  export $(grep -v '^#' /root/portafolio/.env | xargs)
fi

BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
CHAT_ID="${TELEGRAM_CHAT_ID}"

# Comprobar que Telegram está configurado
if [ -z "$BOT_TOKEN" ] || [ -z "$CHAT_ID" ]; then
  echo "$(date): Telegram no configurado, saltando alerta."
  exit 0
fi

# Hacer petición al health endpoint (timeout 10s)
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$HEALTH_URL")

if [ "$HTTP_STATUS" = "200" ]; then
  # Backend OK
  if [ -f "$FLAG_FILE" ]; then
    # Estaba caído, ahora vuelve a estar arriba
    rm -f "$FLAG_FILE"
    send_telegram "✅ <b>Portfolio recuperado</b>%0AEl servidor vuelve a estar en línea.%0A🕐 $(date '+%H:%M %d/%m/%Y')"
  fi
else
  # Backend caído
  if [ ! -f "$FLAG_FILE" ]; then
    # Primera vez que detectamos la caída — enviar alerta
    touch "$FLAG_FILE"
    send_telegram "🚨 <b>Portfolio CAÍDO</b>%0AEl backend no responde (HTTP ${HTTP_STATUS}).%0A🕐 $(date '+%H:%M %d/%m/%Y')%0A%0ARevisa con: <code>pm2 status</code>"
  fi
fi
