# localchat

anonymous-style local chat. password protected. no logs.

## install

```bash
npm install
```

## start

```bash
npm start
```

## connect

- same pc: `http://localhost:3000`
- other pc: `http://YOUR_IP:3000`

find your ip:
```bash
ipconfig
```

## password

edit `.env` file
```
CHAT_PASSWORD=minichat
PORT=3000
```

## features

- real-time chat
- image sharing
- no data saved (everything deleted when server stops)
- minimal black/white design

## notes

- only works on local network
- images max 5MB
- all messages in memory only
