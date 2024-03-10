import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';


import KeyAndLinkManager_abi from './contracts/KeyAndLinkManager_abi.json';


/**
 * This component enables users to check their public key from the blockchain,
 * generate a new RSA key pair locally, and then update their public key on the blockchain upon confirmation.
 */
function KeyAndLinkManager() {

    // Address of the KeyManager smart contract
    let contractAddress = "0x4707E4820c44310bE3ce0761e934A48138BC4d9B";

    // States for Smart Contract interaction
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");
    const [contractKey, setContractKey] = useState("");
    const [defaultAccount, setDefaultAccount] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [generatedKey, setGeneratedKey] = useState("");

    // Handler to connect to the user's MetaMask wallet
    const connectWalletHandler = () => {
        window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangedHandler(result[0]);
            })
        }

    /**
     * Handles account change events by updating the user's account address and reconnecting to the contract.
     */
    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        contractConnect(KeyAndLinkManager_abi);
    }


    /**
     * Establishes a connection to the KeyAndLinkManager smart contract.
     */
    const contractConnect = async (abi) => {
        let tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);
    
        let tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);
    
        let tempContract = new ethers.Contract(contractAddress, abi, tempSigner);
        setContract(tempContract);      
    }
    
    /**
     * Retrieves the public key stored on the blockchain for the current user.
     */
    const getKeyFromBlockchain = async () => {
        let key = await contract.getOwnKey();
        setContractKey(key);
     }

    /**
     * Generates a new RSA key pair, saves them locally as public and private .pem files.
     * The public key can then be used to update the user's public key on the blockchain.
     */
     const generateKeys = async () => {
        //sendPublicKeyToServer;
        getPublicKeyFromServer();
     }

    /**
     * Sends the user's Ethereum address to the server and receives a new generated public key in return.
     */
    const getPublicKeyFromServer = async () => {
        const ownerAddress = defaultAccount;

        try {
        const response = await fetch('http://localhost:5051/keymanager', {
            method: 'POST',
            headers: {
            'Content-Type': 'text/plain', 
            },
            body: ownerAddress, 
        });
    
        if (!response.ok) {
            throw new Error('Fehler beim Senden der Daten');
        }
    
        const publicKey = await response.text(); 
        setGeneratedKey(publicKey);
        console.log('Öffentlicher Schlüssel vom Server erstellt:', generatedKey);
        } catch (error) {
        console.error('Fehler:', error.message);
        }
    }

    /**
     * Saves the newly generated public key on the blockchain.
     */
    const sendGeneratedKeyToBlockchain = () => {
        contract.setKey(generatedKey);
    }
   
    return (
        <>
        <div style={{border: '2px solid black'}}>
            <h2>Key Generator</h2>
            <button onClick={connectWalletHandler}>show crypto-account</button>
            <p>Address: {defaultAccount}</p>
            <br/>
            <button onClick={getKeyFromBlockchain}>Check key from Blockchain</button>
            <p>Public-Key on Blockchain:</p>
            <textarea rows={5} cols={50} value={contractKey} readOnly></textarea> <br/>
            <br/>
            <button onClick={generateKeys}>generate keys</button> <br />
            <p>private key saves localy as private.pem with public.pem, which gets load on Blockchain</p> <br/>
            <p>Generated publicKey: {generatedKey}</p>
            <button onClick={sendGeneratedKeyToBlockchain}> Click to safe key on Blockchain</button>
            <br/>
            <br/>
            </div>
            <div >
            <h3>Go to Uploader or Downloader</h3>
            </div>
        </>
    );
}

export default KeyAndLinkManager;

