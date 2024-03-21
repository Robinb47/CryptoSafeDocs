import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'

// Import the ABI of the smart contract
import KeyAndLinkMananger_abi from './contracts/KeyAndLinkManager_abi.json';

function Downloader() {

    // Define the contract address. Update this address after deploying your contract via Remix or another deployment tool.
    let contractAddress = "0x4707E4820c44310bE3ce0761e934A48138BC4d9B";

    // State variables for interacting with the Ethereum blockchain and managing document encryption/decryption.
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");
    const [encryptedDocument, setEncryptedDocument] = useState("");
    const [decryptedDocument, setDecryptedDocument] = useState(""); 
    const [defaultAccount, setDefaultAccount] = useState("");

    // Connect to the user's Ethereum wallet using the MetaMask extension.
    const connectWalletHandler = () => {
        window.ethereum.request({method: 'eth_requestAccounts'})
        .then(result => {
            accountChangedHandler(result[0]);
        })
    }

    /**
     * Update the current user account and reconnect to the contract with the new account.
     */
    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        contractConnect();
    }

    // Establish a connection to the smart contract using ethers.js, specifying the contract address and ABI.
    const contractConnect = async () => {
        let tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, KeyAndLinkMananger_abi, tempSigner);
        setContract(tempContract);
    }

    // Retrieve the encrypted link (document) stored on the blockchain for the current user.
    const getCryptedLink = async () => {
        let encryptedLink = await contract.getDocument();
        setEncryptedDocument(encryptedLink);
    }

    /**
     * Fetches the encrypted document hash from the blockchain.
     * It verifies the user's address and returns their specific hash.
     * Additionaly it checks the WebAuthn auth-token.
     */
    const handleDecryptionPassage = async () => {
        let encrypted = await contract.getDocument();
        console.log("verschlüsselter Hashwert: ", encrypted);

        const authToken = localStorage.getItem("psg_auth_token");

        console.log("Authentifizierungstoken: ", authToken);

        fetch('http://localhost:5052/download', {
            method: 'POST',
            body: encrypted,
            credentials: 'include',
            headers: {
                'Content-Type':  'text/plain',
                Authorization: `Bearer ${authToken}`,
            },
            })
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    console.error('Error decrypting the Document ');
                    throw new Error('Download failed');
                }
            })
            .then((decryptedText) => {
                setDecryptedDocument(decryptedText);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }

    return (
        <>
        <div style={{border: '2px solid black'}}>
            <h2> Downloader </h2>
            
            {/* Button to initiate wallet connection */}
            <button onClick={connectWalletHandler}>show crypto-account</button>
            <p>Address: {defaultAccount}</p>
            
            {/* Button to retrieve the encrypted document link from the blockchain */}
            <button onClick={getCryptedLink}>click for document on Blockchain</button>
            <textarea rows={2} cols={30} value={encryptedDocument} readOnly></textarea> <br/>

            {/* Button to initiate the decryption process */}
            <button onClick={handleDecryptionPassage}>click to decrypt ipfs-Link</button>
            <textarea rows={2} cols={30} value={decryptedDocument} readOnly></textarea> 
            <br/>
            <br/>

        </div>
            <div>
              <h3> Go to Uploader or KeyGenerator </h3>
            </div>

        </>
    );
    
}

export default Downloader;