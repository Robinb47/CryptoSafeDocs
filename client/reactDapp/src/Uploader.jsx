import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import KeyAndLinkManager_abi from './contracts/KeyAndLinkManager_abi.json';


function Uploader() {
  // Address of the deployed smart contract
  let contractAddress = "0x4707E4820c44310bE3ce0761e934A48138BC4d9B";

    // State hooks for managing file upload and interaction with the smart contract
    const [file, setFile] = useState(null); // Holds the file selected by the user
    const [ipfsHash, setIpfsHash] = useState(''); // State for the IPFS hash of the uploaded document

  // States for smart contract interaction
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");

   const [contractKey, setContractKey] = useState(""); // Public key retrieved from the blockchain
   const [defaultAccount, setDefaultAccount] = useState(""); // User's Ethereum account address
   const [recipientKey, setRecipientKey] = useState(""); // Recipient's public key

  // Connects to the user's Ethereum wallet
   const connectWalletHandler = () => {
    window.ethereum.request({method: 'eth_requestAccounts'})
    .then(result => {
        accountChangedHandler(result[0]);
    })
  }

  //Handles account changes, updating the default account and reconnecting the contract
  const accountChangedHandler = (newAccount) => {
      setDefaultAccount(newAccount);
      contractConnect();
  }

    // Updates the file state when the user selects a file
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };

    // Establishes a connection to the smart contract
    const contractConnect = async () => {
      let tempProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(tempProvider);

      let tempSigner = await tempProvider.getSigner();
      setSigner(tempSigner);

      let tempContract = new ethers.Contract(contractAddress, KeyAndLinkManager_abi, tempSigner);
      setContract(tempContract);      

    }

    // Retrieves the public key from the blockchain
    const getKeyFromBlockchain = async () => {
      let key = await contract.getKey();
      setContractKey(key);
    }

  // Handles the file upload process, including sending the file and public key to the server
    const handleFileUpload = async () => {
        if (file) {
          const formData = new FormData();
          formData.append('pdf', file);
          formData.append('recipientKey', contractKey);

        // Retrieves authentication token for WebAuthn
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
                setIpfsHash(data))) // Sets the IPFS hash of the uploaded document
            .catch((error) => {
              console.error('Error uploading PDF:', error);
            });
        }
      };

    // Saves the document's IPFS hash on the blockchain.
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

export default Uploader;