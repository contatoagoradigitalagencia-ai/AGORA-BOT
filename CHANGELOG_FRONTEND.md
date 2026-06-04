# Changelog — Frontend Agora Bot 2

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
