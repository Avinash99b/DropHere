
# 🎯 Drophere Frontend (Next.js)

This is the **Next.js** frontend for the [Drophere](https://github.com/your-org/drophere) project — a **peer-to-peer, privacy-first file and message sharing platform**. This app uses **WebRTC** to create direct encrypted channels between browsers and Firebase Realtime Database as the default signaling backend.

---

## ⚙️ Tech Stack

- **Next.js** – React framework for building UI
- **Firebase Realtime Database** – For offer/answer signaling
- **WebRTC** – Direct peer-to-peer messaging + file transfer
- **Web Crypto API** – Optional end-to-end encryption
- **TailwindCSS** – For minimal and responsive design

---

## 📁 Folder Structure (Test )

```text
Frontend/
├── src/
│   └── app
│       ├── page.tsx         # Main app UI
│       └── app.tsx          # Global styles
├── public/               # Static assets
├── styles/
│   └── globals.css       # Tailwind and global styles
├── next.config.js
├── package.json
└── README.md             # You are here
```

---

## 🚀 Features

| Feature               | Description                                                      |
| ---------------------|------------------------------------------------------------------ |
| 📡 WebRTC Signaling   | Create direct, encrypted P2P connections                         |
| 🔐 End-to-End Crypto  | Uses Web Crypto API (optional AES layer before sending data)     |
| 🧩 Firebase Adapter   | Uses Firebase Realtime DB for offer/answer exchange              |
| 🧼 Stateless Frontend | No cookies, no accounts, no tracking                             |
| 🌐 Serverless Ready   | Deployable to Vercel, Netlify, or static host                    |

---

## 🌍 Environment Variables (TEST)

Copy `.env.local.example` to `.env.local` and fill in your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_DB_URL=https://your-project-id.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

> ⚠️ These values are exposed to the client. Keep only necessary keys here.

---

## 🛠️ Getting Started

```bash
git clone https://github.com/your-org/drophere.git
cd drophere/Frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000)

---

## 🧠 How It Works

1. User A creates an "offer" via WebRTC.
2. Offer is written to Firebase under a unique peer ID.
3. User B loads the app with the peer ID, responds with an "answer".
4. WebRTC `RTCPeerConnection` establishes a P2P DataChannel.
5. Files/messages flow **directly** from peer to peer — encrypted.

---

## 🔐 Optional Encryption Layer

You can enable AES-GCM or custom key-exchange encryption before sending messages/files. We use Web Crypto API for this:

```ts
// utils/encryption.ts (optional)
const encrypted = await encryptWithAESGCM(data, sharedSecret);
```

---

## 🧪 Testing

You can simulate two peers by:

1. Opening two browser tabs (or devices).
2. Have one peer generate a session ID and wait.
3. Second peer pastes session ID and connects.
4. Begin file/message transfer.

---

## 📦 Production Deployment

```bash
# Build for production
npm run build

# Start server (e.g., on Vercel)
npm run start
```

✅ Can be deployed to:
- Vercel
- Netlify (via adapter)
- Static CDN (with export)
- Firebase Hosting

---

## 🤝 Contributing

Contributions welcome!

Add new features like:

- 🔄 QR Code Sharing
- 📦 Chunked File Transfer
- 🌍 Fallback signaling layers (Redis, WebSocket)

---

## 📄 License

MIT — Free to use, fork, and modify.

---

## 📬 Contact

Open an issue or discussion on [GitHub](https://github.com/your-org/drophere).