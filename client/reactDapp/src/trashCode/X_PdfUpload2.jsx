import React, { useEffect, useState } from 'react';

function PdfUpload2() {
    //useState definieren
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState(''); // Neuer Zustand für den IPFS-Hash


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
          })
            .then((response) => {
              if (response.ok) {
                return response.text();
                setIpfsHash(response.text());
              } else {
                console.error('Error uploading PDF:', response.statusText);
                throw new Error('Upload failed');
              }
            })
            .then((data => 
                setIpfsHash(data)))
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
        </div>
      );
};

export default PdfUpload2;