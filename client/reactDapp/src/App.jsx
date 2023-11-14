import React, { useState } from 'react';

const App = () => {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(''); // Neuer Zustand für den IPFS-Hash

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('pdfFile', file);

      fetch('http://localhost:5040/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Parsen der JSON-Antwort
          } else {
            console.error('Error uploading PDF:', response.statusText);
          }
        })
        .then((data) => {
          if (data.ipfsHash) {
            setIpfsHash(data.ipfsHash); // Setzen des IPFS-Hash im Zustand
          }
        })
        .catch((error) => {
          console.error('Error uploading PDF:', error);
        });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".pdf" />
      <button onClick={handleFileUpload}>Upload PDF</button>
      {ipfsHash && <p>IPFS-Hash: {ipfsHash}</p>} {/* Zeige den IPFS-Hash an */}
    </div>
  );
};

export default App;
