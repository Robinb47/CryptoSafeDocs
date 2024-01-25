import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';

//import KeyManager_abi from './contracts/KeyManager_abi.json';

import KeyAndLinkManager_abi from './contracts/KeyAndLinkManager_abi.json';


/**
 * This component gives your own public key on the blockchain back.
 * You are able to generate a new RSA key pair, which is getting saved localy.
 * The generated public key can override your public key on blockchain after you confirm.
 */
function KeyAndLinkManager() {

    //KeyManager contractaddress
    let contractAddress = "0x17da2467579b8C5755E7825DaCa3aac617B89c6E";

    //Erweiterung für Smart Contract Interaktion
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");

    const [contractKey, setContractKey] = useState("");
    const [defaultAccount, setDefaultAccount] = useState("");
    const [publicKey, setPublicKey] = useState("");
   
    const [generatedKey, setGeneratedKey] = useState("");

    const connectWalletHandler = () => {

        window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangedHandler(result[0]);
            })
        }

    /**
     * Changes the address by change
     */
    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        contractConnect(KeyAndLinkManager_abi);
    }


    /**
     * Setting connection with SmartContract: KeyAndLinkManager
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
    * Shows the saved public key on blockchain
    */
    const getKeyFromBlockchain = async () => {
        let key = await contract.getOwnKey();
        setContractKey(key);
     }

     /**
      * This methods creates a RSA Keypair and saves them as public and private.pem
      * The public keys will be overwrite the value on blockchain.
     */
     const generateKeys = async () => {
        //sendPublicKeyToServer;
        getPublicKeyFromServer();
     }

     /**
      * sending own crypto-address to server
      * receive new generated key from server
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
     * This method saves the generated public key on the Blockchain.
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

