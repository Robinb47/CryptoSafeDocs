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
      formData.append('pdf', file);

      console.log("added FormData: ", file);

      fetch('http://localhost:5050/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            const data = response.jsaon();
            setIpfsHash(data.ipfsLink)
            return response.json(); // Parsen der JSON-Antwort
          } else {
            console.error('Error uploading PDF:', response.statusText);
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
      <p>IPFS-Hash: {ipfsHash}</p>
      {ipfsHash && <p>IPFS-Hash: {ipfsHash}</p>} {/* Zeige den IPFS-Hash an */}
    </div>
  );
};

export default App;
