import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers'
import forge from 'node-forge';

//import RSAPublicKeyRegistry_abi from './contracts/RSAPublicKeyRegistry_abi.json';
import { setegid } from 'process';

import KeyManager_abi from './contracts/KeyManager_abi.json';

import KeyAndLinkManager_abi from './contracts/KeyAndLinkManager_abi.json';

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

   //Key&LinkManager Address
   let contractAddress = "0x5dcD32D9F30999D537695B2029579481540392e2";

   //erkennt MetaMask-Account ohne button Click

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

    //Kann raus
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

      let tempContract = new ethers.Contract(contractAddress, KeyAndLinkManager_abi, tempSigner);
      setContract(tempContract);      
      
    }

    const getKeyFromBlockchain = async () => {
      let key = await contract.getKey();
      setContractKey(key);
    }


    const handleFileUpload = async () => {
        if (file) {
          const formData = new FormData();
          formData.append('pdf', file);
          formData.append('recipientKey', contractKey);

          //FÜR WEBAUTHN hinzugefügt
          const authToken = localStorage.getItem("psg_auth_token");

          fetch('http://localhost:5052/upload', {
            method: 'POST',
            body: formData,
            //für Passage hinzugefügt bis lila Klammer
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
          })
          //bis hier für Passage
            .then((response) => {
              if (response.ok) {
                return response.text();
                setIpfsHash(response.text());
                contract.setDocument(ipfsHash);
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

      const saveDoc = () => {
        contract.setDocument(ipfsHash);
      }

      return (
        <div style={{border: '2px solid black'}}>
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
          <button onClick={saveDoc}>click to save encrypted document on Blockchain</button>
          </div>
      );
};

export default UploadWithKey;