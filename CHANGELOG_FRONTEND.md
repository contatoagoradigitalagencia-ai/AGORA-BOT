# Changelog — Frontend Agora Bot 2

## 2026-06-05 — Renderizacao segura de imagem e video

### Módulo
Chat / mensagens de midia

### Problema
Imagem e video podiam chegar com URL em `message.media.url`, `message.data.image.url`, `message.data.video.url`, `link` ou campos legados. Os componentes liam poucos caminhos e exibiam "indisponivel" mesmo quando a URL existia.

### Solução
- Novo helper `mediaSource()` centraliza a ordem segura de leitura de URLs.
- `Image.jsx` tenta `message.media.url`, `data.image.url`, `data.url`, `data.image.link`, `data.link` e fallbacks equivalentes.
- `Video.jsx` usa a mesma regra para `video`.
- Em desenvolvimento, mensagens sem URL registram `[MEDIA UI MISSING URL]` sem quebrar a tela.

### Como testar
```bash
npm run build
```

---

## 2026-06-04 — Bot por REST e Catalogo MongoDB

### Módulo
Bot + Catalogo

### Problema
As telas Bot e Planilhas dependiam de eventos Socket.IO legados. Quando esses eventos nao eram respondidos pelo AGORA-BOT-2, a tela ficava em loading infinito e o painel nao conseguia pausar a IA.

### Solução
- Tela Bot agora carrega por `GET /api/v1/bot-config`.
- Botao de pausa/ativacao da IA chama `PATCH /api/v1/whatsapp-accounts/:id/settings` com `autoReply`.
- Editor de prompt salva via `POST/PATCH /api/v1/prompts`.
- Tela Planilhas foi substituida por Catalogo, consumindo `GET /api/v1/products`, `/services` e `/plans`.
- Estados vazios adicionados para banco sem produtos, servicos ou planos.

### Como testar
```bash
npm run build
```

---

## 2026-06-04

### Módulo
Migração inicial para repositório AGORA-BOT

### Problema
Frontend oficial estava apenas em pacote zip (`Agora-Front-main`), fora do GitHub dedicado e desacoplado do backend AGORA-BOT-2.

### Solução
- Publicação do projeto Vite + React existente como base oficial do frontend.
- Separação explícita: frontend (AGORA-BOT) / backend (AGORA-BOT-2).
- `.env` do zip isolado; uso de `.env.example` com `VITE_URL_BACK_END` e `VITE_API_URL`.

### Arquivos alterados
- Estrutura completa `src/` (rotas, componentes, socket, utils).
- `.gitignore`, `.env.example`, documentação de changelog.

### Como testar
```bash
cp .env.example .env
# Defina VITE_URL_BACK_END apontando para AGORA-BOT-2
npm install
npm run dev
npm run build
```
