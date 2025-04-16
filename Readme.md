# 📄 Document Certifier — MVP

A web application to certify and verify documents using blockchain technology. This MVP allows users to register a document on the blockchain and view all certified records.

---

## ✨ Main Features

- Upload documents (PDF, etc.)
- Calculate the SHA-256 hash of the document
- Register the hash on the public blockchain (Polygon Amoy)
- View certified documents (hash, date, wallet, transaction)
- Connect with MetaMask (sign and interact with blockchain)
- Backend acting as a bridge between frontend and blockchain

---

## 🧱 Project Structure

```
📦doc-certifier/
├── 📁blockchain       # Smart contract + Hardhat + deployment
├── 📁server           # Backend with Node.js (Express + Ethers.js)
├── 📁client           # Frontend with React (Wagmi + Ethers + optional Tailwind CSS)
└── README.md
```

---

## 🚀 How to Run the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Txominerras/doc-certifier.git
cd doc-certifier
```

### 2. Smart contract (optional if already deployed)

```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network amoy
```

> Save the contract address and update it in both backend and frontend.

---

### 3. Backend (server)

```bash
cd ../server
npm install
# Create a .env file with the following variables:
# RPC_URL=https://rpc-amoy.polygon.technology
# CONTRACT_ADDRESS=0xYourContractAddress
npm start
```

---

### 4. Frontend (client)

```bash
cd ../client
npm install
npm run dev
```

> Open http://localhost:5173 in your browser.

---

## 🛠 Technologies Used

- **Frontend**: React, Wagmi, Ethers.js, MetaMask, Vite
- **Backend**: Node.js, Express, Ethers.js
- **Blockchain**: Solidity, Hardhat, Polygon Amoy testnet
- **Hashing**: SHA-256 (Node crypto)
- **Styling**: Custom minimal CSS

---

## 📦 Future Improvements

- Document verification (upload and check if registered)
- Role-based access (admin, validator)
- Advanced electronic signature (eIDAS)
- Integration with SharePoint or other systems
- Database support (PostgreSQL or MongoDB) for full traceability
- Admin dashboard

---

## 📃 License

MIT — Feel free to use this project as a base for legal or corporate blockchain applications.

---

## ✉️ Contact

Developed by Txominerras  
This project was created as a personal MVP for document certification using blockchain.
