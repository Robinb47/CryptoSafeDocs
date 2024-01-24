import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'

import KeyAndLinkManager_abi from './contracts/KeyAndLinkManager_abi.json';

function UploadWithKey() {


  //contractaddress from smart contract
  let contractAddress = "0x5dcD32D9F30999D537695B2029579481540392e2";

    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState(''); // Neuer Zustand für den IPFS-Hash

    //useState for smart contract interaction
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");

   const [contractKey, setContractKey] = useState("");
   const [defaultAccount, setDefaultAccount] = useState("");
   const [recipientKey, setRecipientKey] = useState("");


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
        <>
        <div style={{border: '2px solid black'}}>
            <h2> Uploader </h2>
            <button onClick={connectWalletHandler}>Click to see logged crypto-account</button>
            <p>Address: {defaultAccount}</p>

            <br/>

            <button onClick={getKeyFromBlockchain}>Click here to see saved Key from Blockchain</button>
            <p>Blockchain-Key:</p>
            <textarea rows={5} cols={50} value={contractKey} readOnly></textarea>
            <br/>
    
          <input type="file" onChange={handleFileChange} accept=".pdf" />
          <button onClick={handleFileUpload}>Upload PDF</button>
          <p>IPFS-Hash: {ipfsHash}</p>
          <button onClick={saveDoc}>click to save encrypted document on Blockchain</button>
        <br/>
        <br/>
        </div>
        <div>
           <h3> Go to KeyGenerator or Downloader</h3>
        </div>
        </>
      );
};

export default UploadWithKey;