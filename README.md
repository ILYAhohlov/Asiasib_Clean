# Asiasib - Каталог товаров

## Деплой на Render.com

### Backend (server/)
1. Создать Web Service на Render
2. Подключить GitHub репозиторий
3. Настроить:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Root Directory: оставить пустым

### Переменные окружения на Render:
```
ADMIN_PASSWORD=633100admin
JWT_SECRET=your_super_secret_jwt_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asiasib
SUPABASE_URL=https://pdlhdxjsjmcgojzlwujl.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
FRONTEND_URL=https://asiasib.vercel.app
PORT=10000
```

### Frontend на Vercel
1. Подключить GitHub репозиторий
2. Настроить переменную:
   - `VITE_API_URL=https://your-render-app.onrender.com`

## Вход в админку
- Пароль: **633100admin**
- URL: `/admin-login`

## Структура проекта
- `/src` - Frontend (React + TypeScript)
- `/server` - Backend (Node.js + Express)
- Минимальные зависимости для быстрой загрузки