# 🔧 Drophere Backend

The **Drophere Backend** handles the core signaling, and supports establishing **peer-to-peer (P2P)** encrypted
messaging and file transfer using **PeerJS** as a signaling mechanism.

This backend is part of the parent project [`drophere`](https://github.com/avinash99b/drophere), designed with a *
*modular microservice architecture** to ensure flexibility and replaceability of core components like signaling and
encryption.

---

## 🚀 Tech Stack

- **Node.js + Express** – Lightweight REST API server
- **PeerJS** – Used for peer signaling and connection initiation
- **Modular/Micro Structure** – Swappable signaling modules (Firebase, Redis, WebSocket, etc.)

---

## 📁 Folder Structure

```text
Backend/
├── src/
│   ├── config/           # Firebase & environment setup
│   ├── Controllers/      # Core Business Logic attached with postgres DB
│   ├── Errors/           # Errors and types
│   ├── ValidatorTypes/   # Express-Validator type declarations
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
|-----------------------------|-----------------------------------------------------------------------|
| 🔐 No Message/File Storage  | This backend never stores actual file or message content.             |
| 🔁 PeerJS Signaling         | Uses PeerJS to automate offer/answer signaling for WebRTC peers.      |
| 🧩 Modular Signaling Engine | Built to be easily extendable or replaceable (e.g. Redis, WebSocket). |
| 🛡️ Privacy-Centric Design  | No user accounts, no logs, no surveillance.                           |
| 🧼 Stateless Server         | Ideal for scaling and ephemeral communication sessions.               |

---

## 🌍 Environment Variables

Create a `.env` file in the root of the `Backend/` folder using the provided `.env.example` as a reference:

```env
PORT=3001
DATABASE_URL=YOUR_DATABASE_URL
```

> ⚠️ Make sure to escape `\n` in private keys when pasting into `.env`

---

## 🚀 Getting Started

### 1. Clone the Backend (if standalone):

```bash
git clone https://github.com/avinash99b/drophere-backend.git
cd drophere-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Postgresql

* The Postgresql service will automatically be created when launched with docker image
* If u want to use custom postgresql server, just replace the DATABASE_URL environment variable with custom Postgresql
  server.
* U can use the init.sql file located at [`init.sql`](https://github.com/avinash99b/drophere/init.sql)

### 4. Run the Backend

```bash
npm start
```

The server will run at `http://localhost:3001`

---

## 🧠 Microservice Architecture

This backend is **only one module** in the larger `drophere` system. Each part (signaling, encryption, WebRTC peer
management) can be replaced or scaled independently.

Want to replace PeerJS signaling with Redis or WebSockets?

* Modify the FileTransferController in `Controllers/FileTransferController`
* Swap out `FileTransferController` with `Firebase Realtime Database`

---

## 📡 API Overview

While most of the P2P communication is handled via **PeerJS** + **WebRTC**, this backend can expose optional HTTP APIs
for:

| Endpoint                          | Description                                |
|-----------------------------------|--------------------------------------------|
| `POST /transfer/create?type=file` | Creates a File Transfer Request in Server  |
| `GET /transfer/file/676483`       | Returns the Sender PeerJS Id to connect to |
| (optional) `/health`              | Check backend status                       |

> Note: These are optional REST routes. Most signaling is handled in real time by PeerJS SDK in the frontend.

---

## 🛡️ Security Notes

* **No messages or files** are ever stored or logged on the server.
* Peer connections are **ephemeral** and not persisted.
* Firebase rules can be locked down to prevent abuse or leakage.

---

## 🧪 Testing

You can test backend endpoints using tools like Postman or curl. For signaling test cases, make sure the Postgresql DB is connected and the frontend instances are running.

---

## 📄 License

MIT — Free to use, modify, and share.

---

## 🤝 Contributing

We welcome contributions! This backend is intended to be modular, swappable, and cleanly documented.

```bash
# To add a new signaling service
src/Modules/signaling/myCustomSignaler.ts
```

---

## 📬 Contact

Need help or want to contribute? Join the project on GitHub or reach out via issues or discussions.
