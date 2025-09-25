# 🌿 Blockchain Traceability System (PS-25027)

A secure backend service for tracking medicinal plant collections with blockchain-style immutability and digital signatures.
Built with Express.js and Node.js, this project ensures that once data is stored, it cannot be tampered with — providing cryptographic proof of authenticity.

---

## 🚀 Features

- **Collection event recording** (Farmer → Collector → Species → Quantity) 
- **Blockchain immutability** using currentHash + previousHash 
- **Digital signatures** with server_private.pem and server_public.pem 
- **Tamper-proof verification** (any DB manipulation breaks the chain) 
- **EST API** for submitting & retrieving collection events
- **Simple, demo-ready output** for juries and hackathons
---

## 📂 Project Structure
```bash
herb-track-backend/
│── app.js # Express server & routes
│── blockchain.js # Blockchain logic (hashing + signing)
│── routes/
│ └── collections.js # Collection API routes
│── data/
│ └── blockchain.json # Stores blockchain events
│── keys/
│ ├── server_private.pem # Private key for signing
│ └── server_public.pem # Public key for verification
│── package.json # Node.js dependencies
│── README.md # Project documentation
```

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/herb-track-backend.git
cd herb-track-backend
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Generate Keys
```bash
mkdir keys
openssl genpkey -algorithm RSA -out keys/server_private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in keys/server_private.pem -out keys/server_public.pem
```

## ▶️ Running the Service
```bash
node app.js
```

Server starts on:

👉 Root: http://localhost:5000/

👉 API: http://localhost:5000/api/collections

## 📌 Usage (Demo Flow)
 
###  1. POST a Collection Event 

POST http://localhost:5000/api/collections

Content-Type: application/json

<img width="1476" height="434" alt="image" src="https://github.com/user-attachments/assets/af9cbdc9-285d-46fb-9037-7ae1aaba9b6b" />


```bash
{
"event_id": "E1001",
"timestamp": "2025-09-19T10:00:00Z",
"collector": {
"collector_id": "F001",
"name": "Ramesh"
},
"species": {
"common_name": "Ashwagandha"
},
"quantity_kg": 25
}
```
✅ Response:

<img width="1496" height="333" alt="image" src="https://github.com/user-attachments/assets/438656e3-8a4d-4a90-9939-0cfca9e8032d" />


```bash
{
"success": true,
"message": "Collection event recorded",
"blockchainTxId": "c6dc46016b14",
"currentHash": "hash123...",
"previousHash": "hashPrev...",
"signature": "MEUCIQ...",
"signatureValid": true
}
```
###  2. GET a Collection Event

POST http://localhost:5000/api/collections

Content-Type: application/json

<img width="1476" height="301" alt="image" src="https://github.com/user-attachments/assets/5323aae1-aa6a-4039-a512-89bb8125bcd0" />


```bash
GET http://localhost:5000/api/collections/E1001
```
✅ Response:

<img width="467" height="315" alt="image" src="https://github.com/user-attachments/assets/ee1d4420-a00f-4b00-8e9c-d59adce0735a" />


```bash
{
"event_id": "E1001",
"species": "Ashwagandha",
"quantity_kg": 25,
"currentHash": "hash123...",
"previousHash": "hashPrev...",
"signatureValid": true
}
```

### server_private.pem 

<img width="812" height="602" alt="image" src="https://github.com/user-attachments/assets/afb61546-d97b-47ce-825d-a333145e545d" />

### server_public.pem 

<img width="690" height="249" alt="image" src="https://github.com/user-attachments/assets/61641074-3dba-4d43-bd07-a2a52bd8d3c4" />


## 🛠️ Tech Stack

- **Node.js + Express** – API backend
- **Crypto (RSA)** – Digital signatures & hashing 
- **JSON-based Blockchain** – Lightweight immutable chain

---

## 🔮 Future Enhancements
-  Build frontend dashboard for visualization
-  AI/ML integration for species life cycle & health detection
-  Satellite data integration for real-time geo-monitoring & yield prediction 
-  Deploy on cloud (AWS / Azure / GCP) 
---

## 👨‍💻 Team
- **Govind Dubey** → Backend Systems Engineer
- **Achyut Kumar Pandey** → Backend Systems Engineer
- **Harshita Singh** → Data Acquisition & Documentation Lead
- **Pragya Gupta** → Web Frontend Engineer
- **Harsh Singh** →AI/ML Engineer
- **Vaibhav Porwal** → Mobile App Developer
