import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers'
import forge from 'node-forge';

import RSAPublicKeyRegistry_abi from './contracts/RSAPublicKeyRegistry_abi.json';
import { setegid } from 'process';


function PdfWithRecipient() {
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
   let contractAddress = "0xCa86a1D98927af40feb7833622b9A5BAd1bb041E";

   const connectWalletHandler = () => {

    window.ethereum.request({method: 'eth_requestAccounts'})
    .then(result => {
        accountChangedHandler(result[0]);
    })
  }

const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    keyRegistration();
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
    //Erweiterung Ende


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };


    //holt den public Key des Empfängers von der Blockchain
    const getPublicKeyFromRecipient = async () => {

        let tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, RSAPublicKeyRegistry_abi, tempSigner);
        setContract(tempContract);

        //Erhalte Schlüssel von der Blockchain
        let pKey = contract.getRSAPublicKey();
        setRecipientKey(pKey);

        //Bis hier hin ist alles korrekt 
        let addressString = items[0].toString();
        console.log("Dein Adress-String lautet: ", addressString);
        console.log(typeof addressString);
              
        //Anpassung und Versuch für Blockchain
        //let blockchainKey = contract.getRecipientKey(addressString);
        let blockchainKey = await contract.getRSAPublicKey();
        
        setRecipientKey(blockchainKey);
        console.log("Adresse erfolgreich von der Wallet geholt");
        console.log("Das ist der Public-Key deiner Wallet: ", blockchainKey);
        
        
        //setRecipientKey(blockchainKey);

        //let addressString = address.toString();
        //console.log(typeof addressString);
        //const address = ethers.utils.getAddress(addressString);
        
        //kommt vom Fronted und nicht vom Smart Contract
        //setRecipientKey(addressString);

        //let walletAddress = ethers.utils.getAddress(addressString);
        //let publicKeyFromRecipient = contract.getRecipientKey(walletAddress);
        //setRecipientKey(publicKeyFromRecipient.toString());
        //return publicKeyFromRecipient;
    }


    const handleFileUpload = async () => {
        if (file) {
          const formData = new FormData();
          formData.append('pdf', file);

          //getPublicKeyFromRecipient();
          //getPublicKeyFromRecipient();
          //let publicKeyRecipient = getPublicKeyFromRecipient();
          //let publicKeyRecipient = getPublicKeyFromRecipient();
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
          <button onClick={getPublicKeyFromRecipient}>Click for public key</button>
          <p>Public Key from Recipient: {recipientKey}</p>
        </div>
      );
};

export default PdfWithRecipient;