import React, { useEffect, useState } from 'react';

/*  Änderungsplan:
* Nutzer gibt Ziel-Adresse mit public-Key ein
* sendet an Server gemeinsam mit Pdf
* Server lädt Datei auf Ipfs hoch
** verschlüsselt IpfsLink
*** Rückgabe an Fronted
*/


function PdfWithListUpload() {
    //useState definieren
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState(''); // Neuer Zustand für den IPFS-Hash

    // Erweiterungen für die mitgesendete Liste
    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState([]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
          // Neues Element zur Liste hinzufügen
          setItems([...items, inputValue.trim()]);
          // Eingabefeld leeren
          setInputValue('');
        }
      };
    //Erweiterung Ende


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };



    const handleFileUpload = () => {
        if (file) {
          const formData = new FormData();
          formData.append('pdf', file);

          formData.append('accessList', items);
        
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
            {/*  
                Erweiterung für die Wallet Liste 
            */}
            <h3>Wallets with Access</h3>
            <ul>
                {items.map((item, index) => (
                <li key={index}>{item}</li>
                ))}
            </ul>
            <input type="text" value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="enter public key"
            />
            <button onClick="">send list</button>
            {/* Erweiterung Ende */}

          <input type="file" onChange={handleFileChange} accept=".pdf" />
          <button onClick={handleFileUpload}>Upload PDF</button>
          <p>IPFS-Hash: {ipfsHash}</p>
        </div>
      );
};

export default PdfWithListUpload;