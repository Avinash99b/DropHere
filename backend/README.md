# 🔧 Drophere Backend

The **Drophere Backend** handles the core signaling, encryption utility endpoints (if any), and supports establishing **peer-to-peer (P2P)** encrypted messaging and file transfer using **Firebase Realtime Database** as a signaling mechanism.

This backend is part of the parent project [`drophere`](https://github.com/your-org/drophere), designed with a **modular microservice architecture** to ensure flexibility and replaceability of core components like signaling and encryption.

---

## 🚀 Tech Stack

- **Node.js + Express** – Lightweight REST API server
- **Firebase Realtime Database** – Used for peer signaling and connection initiation
- **WebSockets (future-ready)** – Placeholder for alternative signaling layers
- **Modular/Micro Structure** – Swappable signaling modules (Firebase, Redis, WebSocket, etc.)

---

## 📁 Folder Structure

```text
Backend/
├── src/
│   ├── config/           # Firebase & environment setup
│   ├── Controllers/      # Core Business Logic attached with postgres DB
│   ├── Errors/           # Errors and types
│   ├── Modules/          # Abstraction for API to core business logic
│   ├── MiddleWare/       # Request Middlewares
│   ├── services/         # Signaling logic, peer session control
│   ├── routes/           # Express API endpoints
│   ├── utils/            # Crypto helpers, validation, etc.
│   └── index.ts          # Entry point
├── .env.example          # Environment variable template
├── package.json
├── service-account.json  # Firebase service account file, put yours here
└── README.md             # You are here
````

---

## ⚙️ Features

| Feature                     | Description                                                           |
| --------------------------- | --------------------------------------------------------------------- |
| 🔐 No Message/File Storage  | This backend never stores actual file or message content.             |
| 🔁 Firebase Signaling       | Uses Firebase to manage offer/answer signaling for WebRTC peers.      |
| 🧩 Modular Signaling Engine | Built to be easily extendable or replaceable (e.g. Redis, WebSocket). |
| 🛡️ Privacy-Centric Design  | No user accounts, no logs, no surveillance.                           |
| 🧼 Stateless Server         | Ideal for scaling and ephemeral communication sessions.               |

---

## 🌍 Environment Variables

Create a `.env` file in the root of the `Backend/` folder using the provided `.env.example` as a reference:

```env
PORT=3001
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_DB_URL=https://your-project-id.firebaseio.com
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```

> ⚠️ Make sure to escape `\n` in private keys when pasting into `.env`

---

## 🚀 Getting Started

### 1. Clone the Backend (if standalone):

```bash
git clone https://github.com/your-org/drophere-backend.git
cd drophere-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

* Go to [Firebase Console](https://console.firebase.google.com/)
* Create a Realtime Database project.
* Add a service account and download the credentials JSON.
* Replace service-account.json with your credentials.

### 4. Run the Backend

```bash
npm start
```

The server will run at `http://localhost:3001`

---

## 🧠 Microservice Architecture

This backend is **only one module** in the larger `drophere` system. Each part (signaling, encryption, WebRTC peer management) can be replaced or scaled independently.

Want to replace Firebase signaling with Redis or WebSockets?

* Write a new adapter in `services/signaling/`
* Swap out `firebaseSignaler` in `index.js`

---

## 📡 API Overview

While most of the P2P communication is handled via **Firebase** + **WebRTC**, this backend can expose optional HTTP APIs for:

| Endpoint                | Description                       |
| ----------------------- | --------------------------------- |
| `POST /signal/offer`    | Post a WebRTC offer to Firebase   |
| `POST /signal/answer`   | Post an answer                    |
| `GET /signal/:peerId`   | Retrieve peer signal              |
| `POST /cleanup/:peerId` | Optional: clear expired peer data |
| (optional) `/health`    | Check backend status              |

> Note: These are optional REST routes. Most signaling is handled in real time by Firebase client SDK in the frontend.

---

## 🛡️ Security Notes

* **No messages or files** are ever stored or logged on the server.
* Peer connections are **ephemeral** and not persisted.
* Firebase rules can be locked down to prevent abuse or leakage.

---

## 🧪 Testing

You can test backend endpoints using tools like Postman or curl. For signaling test cases, make sure the Firebase DB is connected and the frontend PeerJS instances are running.

---

## 📄 License

MIT — Free to use, modify, and share.

---

## 🤝 Contributing

We welcome contributions! This backend is intended to be modular, swappable, and cleanly documented.

```bash
# To add a new signaling service
src/services/signaling/myCustomSignaler.js
```

---

## 📬 Contact

Need help or want to contribute? Join the project on GitHub or reach out via issues or discussions.

```

Let me know if you'd like the matching `README.md` for the `Frontend` submodule next.
```
