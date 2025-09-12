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

## Разработка

### Проблема с памятью в dev режиме
Vite dev server может превышать лимиты памяти. Используйте:

1. **Production билд для тестирования:**
   ```bash
   npm run build
   # Откройте dist/index.html в браузере
   ```

2. **Python сервер для локального тестирования:**
   ```bash
   python serve.py
   # Откройте http://localhost:8080
   ```

3. **Статический HTML тест:**
   ```bash
   # Откройте test.html в браузере
   ```

## Структура проекта
- `/src` - Frontend (React + TypeScript)
- `/server` - Backend (Node.js + Express)
- `/dist` - Production билд
- `test.html` - Статический тест API
- Минимальные зависимости для быстрой загрузки