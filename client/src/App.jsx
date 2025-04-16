// client/src/App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WagmiConfig, createConfig, useAccount, useWriteContract, useConnect } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { http } from 'viem';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';

function ConnectButton() {
  const { isConnected, address } = useAccount();

  const handleConnect = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask not available');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error('❌ Error at connecting the wallet:', error);
    }
  };

  if (isConnected && address) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        ✅ Conected as <code>{address}</code>
      </div>
    );
  }

  return (
    <button onClick={handleConnect} style={{ marginBottom: '1rem' }}>
      Conect Wallet
    </button>
  );
}

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [injected()],
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(),
  },
});

function RegisterHashButton({ hash, onSuccess }) {
  const { isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  const register = async () => {
    try {
      if (!isConnected) return alert('Conecta tu wallet.');
      if (!hash) return alert('No hay hash calculado.');

      const result = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'registerDocument',
        args: [hash.startsWith('0x') ? hash : '0x' + hash],
      });

      setTxHash(result.hash);
      setError(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('❌ Error al registrar documento:', err);
      setError('Error al registrar el documento.');
    }
  };

  return (
    <div>
      <button onClick={register} disabled={!isConnected || isPending}>
        {isPending ? 'Enviando...' : 'Registrar en Blockchain'}
      </button>
      {txHash && (
        <div className="alert">
          ✅ Document registered. <br />
          <strong>Tx:</strong>{' '}
          <a
            href={`https://amoy.polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {txHash.slice(0, 12)}...
          </a>
        </div>
      )}
      {error && <div className="alert" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>{error}</div>}
    </div>
  );
}

function DocumentsTable({ refreshTrigger }) {
  const [documents, setDocuments] = useState([]);

  const fetchDocs = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/documents');
      setDocuments(res.data);
    } catch (err) {
      console.error('❌ Error obtaining the documents:', err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [refreshTrigger]);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>📄 Registrered Documents</h3>
      {documents.length === 0 ? (
        <p>No documents registered.</p>
      ) : (
        <div className="table-wrapper">
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th>Hash</th>
              <th>Wallet</th>
              <th>Date</th>
              <th>Tx</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={index} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td><code>{doc.hash}</code></td>
                <td>{doc.signer}</td>
                <td>{new Date(doc.timestamp * 1000).toLocaleString()}</td>
                <td>
                  <a href={`https://amoy.polygonscan.com/tx/${doc.txHash}`} target="_blank" rel="noopener noreferrer">
                    {doc.txHash.slice(0, 10)}...
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:4000/api/hash', formData);
      setHash(res.data.hash);
    } catch (err) {
      console.error('Error al calcular hash:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="container">
          <ConnectButton />
          <h2>Certificador de Documentos</h2>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit" style={{ marginLeft: '1rem' }}>
              Calcular Hash
            </button>
          </form>
          {loading && <p>Calculando hash...</p>}
          {hash && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Hash SHA-256:</h4>
              <code>{hash}</code>
              <RegisterHashButton hash={hash} onSuccess={() => setRefresh(Date.now())} />
            </div>
          )}
          <DocumentsTable refreshTrigger={refresh} />
        </div>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
