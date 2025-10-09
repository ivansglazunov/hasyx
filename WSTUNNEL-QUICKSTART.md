# 🚀 Быстрый старт: Пробросить localhost:3004 на deep.foundation

## 1️⃣ Добавьте ~/bin в PATH (один раз)

```bash
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## 2️⃣ Проверьте wstunnel

```bash
wstunnel --version
# Должно показать: wstunnel-cli 10.4.0
```

Если не работает, запустите:
```bash
npm run install-wstunnel
```

## 3️⃣ Запустите ваше приложение

**Терминал 1:**
```bash
cd /Users/deep/Documents/GitHub/hasyx
npm run dev
# Запускается на http://localhost:3004
```

## 4️⃣ Пробросьте через туннель

**Терминал 2:**
```bash
cd /Users/deep/Documents/GitHub/hasyx

# Базовая команда (автоматический UUID)
npm run tunnel -- -p 3004

# ИЛИ с конкретным поддоменом
npm run tunnel -- -p 3004 -u my-dev-app

# ИЛИ полная форма с сервером
npm run tunnel -- --port 3004 --uuid my-dev-app --server https://deep.foundation
```

## 5️⃣ Готово! 🎉

Ваш `localhost:3004` теперь доступен по адресу:
```
https://my-dev-app.deep.foundation
```

(или другой UUID, если вы его указали)

---

## ⚠️ Важные моменты

### Аутентификация

Эндпоинт `/api/wstunnel/[uuid]` **требует прав администратора**. 

Если видите ошибку `401 Unauthorized` или `403 Forbidden`:

1. **Получите токен аутентификации** на вашем сервере
2. **Используйте токен:**
   ```bash
   npm run tunnel -- -p 3004 -u my-app -t YOUR_AUTH_TOKEN
   ```

### Что происходит при запуске?

1. 🔐 **Регистрация на сервере** - создается:
   - DNS запись в CloudFlare (`my-app.deep.foundation`)
   - SSL сертификат от Let's Encrypt
   - Nginx конфигурация
   - tmux сессия с wstunnel server

2. 🔌 **Подключение wstunnel client** - локальный:
   - Подключается к серверу через WebSocket
   - Пробрасывает порт 3004

3. 🌐 **Работает!**
   - Внешние запросы → `https://my-app.deep.foundation`
   - Nginx → wstunnel server
   - WebSocket → wstunnel client
   - localhost:3004 → ваше приложение

### Остановка туннеля

```bash
# В терминале с tunnel - нажмите Ctrl+C
# Автоматически:
# - Отключит wstunnel client
# - Удалит DNS, SSL, Nginx на сервере
# - Остановит tmux сессию
```

---

## 🐛 Troubleshooting

### wstunnel command not found

```bash
npm run install-wstunnel
export PATH="$HOME/bin:$PATH"
```

### Server returned 401/403

Нужен токен аутентификации с правами админа:
```bash
npm run tunnel -- -p 3004 -t YOUR_TOKEN
```

### DNS не резолвится

Подождите 1-3 минуты для пропагации DNS.

### SSL ошибка

Сервер создает Let's Encrypt сертификат, это занимает 1-2 минуты.

---

## 📚 Полная документация

См. [WSTUNNEL.md](./WSTUNNEL.md) для:
- Программного API
- Интеграции с Express/Next.js
- Тестирования
- Продвинутых настроек


