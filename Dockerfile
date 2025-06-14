FROM node:20-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY index.js quotes_147.txt ./

# Minimal non-root user
RUN useradd -m bot
USER bot

ENV NODE_ENV=production
CMD ["node", "index.js"]