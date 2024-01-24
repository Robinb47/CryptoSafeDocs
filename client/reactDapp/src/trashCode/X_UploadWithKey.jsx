import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers'
import forge from 'node-forge';

//import RSAPublicKeyRegistry_abi from './contracts/RSAPublicKeyRegistry_abi.json';
import { setegid } from 'process';

import KeyManager_abi from './contracts/KeyManager_abi.json';

function UploadWithKey() {
    //useState definieren
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState(''); // Neuer Zustand für den IPFS-Hash

    // Erweiterungen für die mitgesendete Liste
    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState([]);

    //Erweiterung für Smart Contract Interaktion
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");

   const [contractKey, setContractKey] = useState("");
   const [defaultAccount, setDefaultAccount] = useState("");
   const [recipientKey, setRecipientKey] = useState("");

   //RSAPublicKeyRegistry Address
   let contractAddress = "0x725C9abA3b0B2c8D8feE1C7945bF0384C9Fac5Fa";

   const connectWalletHandler = () => {

    window.ethereum.request({method: 'eth_requestAccounts'})
    .then(result => {
        accountChangedHandler(result[0]);
    })
  }

  const accountChangedHandler = (newAccount) => {
      setDefaultAccount(newAccount);
      contractConnect();
  }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
          // Neues Element zur Liste hinzufügen
          if (inputValue.length == 42 && inputValue.startsWith('0x')) {
            setItems([...items, inputValue.trim()])
            setInputValue('');
          } else {
            setInputValue('ungültige Eingabe');
          }
        }
      };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };

    const contractConnect = async () => {
      let tempProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(tempProvider);

      let tempSigner = await tempProvider.getSigner();
      setSigner(tempSigner);

      let tempContract = new ethers.Contract(contractAddress, KeyManager_abi, tempSigner);
      setContract(tempContract);      
      
    }

    const getKeyFromBlockchain = async () => {
      let key = await contract.getValue();
      setContractKey(key);
    }


    const handleFileUpload = async () => {
        if (file) {
          const formData = new FormData();
          formData.append('pdf', file);
          formData.append('recipientKey', contractKey);

          fetch('http://localhost:5052/upload', {
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
            <button onClick={connectWalletHandler}>Click to see logged crypto-account</button>
            <p>Address: {defaultAccount}</p>
            <button onClick={getKeyFromBlockchain}>Click here to see saved Key from Blockchain</button>
            <p>Blockchain-Key:</p>
            <textarea rows={5} cols={50} value={contractKey} readOnly></textarea>

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
  

          <input type="file" onChange={handleFileChange} accept=".pdf" />
          <button onClick={handleFileUpload}>Upload PDF</button>
          <p>IPFS-Hash: {ipfsHash}</p>
          </div>
      );
};

export default UploadWithKey;