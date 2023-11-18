import React, { useState } from 'react';

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("Was"); // Neuer Zustand für den IPFS-Hash

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('pdf', file);

      fetch('http://localhost:5050/upload', {
        method: 'POST',
        body: formData,
      });

      /* geht nicht
      const data = response.json();

      setIpfsHash("Hallo");

      //setIpfsHash(data.ipfsLink);
      setIpfsHash("Hallo");
*/
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".pdf" />
      <button onClick={handleFileUpload}>Upload PDF</button>
      <p>IPFS-Hash: {ipfsHash}</p>
    </div>
  );
};

export default PdfUpload;
