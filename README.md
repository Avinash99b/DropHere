# 🌐 Drophere

**Drophere** is a privacy-first, peer-to-peer (P2P) messaging and file transfer platform powered by **WebRTC**, 
**PeerJS signaling**, and **modular microservices**. The core principle: **no data stored, no surveillance** — just
ephemeral, encrypted communication between peers.

This monorepo contains both the frontend client and backend signaling service.

---

## 🧩 Project Structure

````
drophere/
├── backend/         # Node.js microservice for signaling (PeerJS, pluggable)
├── frontend/        # Web client using WebRTC for direct peer connection
├── README.md        # You are here
├── init.sql        # Postgresql Initialisation Script
└── LICENSE
````

## 🧰 Tech Stack

Frontend – HTML + JavaScript (Next.js) + WebRTC

Backend – Node.js + Express + PeerJS (as default signaler)

Signaling – PeerJS (replaceable)

Architecture – Microservices, plug-and-play signaling modules

## 🚀 Getting Started (Full Stack)

### 1. Clone the Repo

```bash
    git clone https://github.com/avinash99b/drophere.git
    cd drophere
```

### 2. Setup Backend

```bash
    cd backend
    cp .env.example .env  # Configure Environment Variables
    npm install
    npm start
```

### 3. Setup Frontend

```bash
   cd ../frontend
```

## Open index.html in a browser or serve using a local server (e.g. Live Server)

✅ Peer connections happen directly between browsers. Backend is used only for signaling.

## 🌐 Live Deployment

You can deploy:

Frontend on GitHub Pages, Netlify, or Vercel.

Backend on any Node-compatible host (e.g., Render, Railway, Firebase Cloud Functions).

## ⚙️ Extensibility

Each module can be swapped:

Want Redis or WebSocket instead of PeerJS? Swap backend signaling.

Want React instead of Next.js? Replace frontend structure.

Want encrypted metadata exchange? Add crypto helper in backend utils/.

## 🛡️ Core Philosophy

| Principle	           | Description                           |
|----------------------|---------------------------------------|
| 🔐 Zero Storage      | 	No messages/files stored server-side |
| 🧠 Modular Design	   | Backend modules can be swapped easily |
| 🧼 Stateless Backend | 	Clean and ephemeral architecture     |
| 👤 Anonymous	        | No user login, tracking, or cookies   |

## 🤝 Contributing
Pull requests and ideas are welcome!

