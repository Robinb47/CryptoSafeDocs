import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';

import KeyManager_abi from './contracts/KeyManager_abi.json';

import KeyLinkManager_abi from '';


function KeyManager() {

    //Erweiterung für Smart Contract Interaktion
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");

    const [contractKey, setContractKey] = useState("");
    const [defaultAccount, setDefaultAccount] = useState("");
    const [publicKey, setPublicKey] = useState("");
   
    const [generatedKey, setGeneratedKey] = useState("");


    //KeyManager Contractaddress
    let contractAddress = "0x725C9abA3b0B2c8D8feE1C7945bF0384C9Fac5Fa";


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
        contractConnect(KeyManager_abi);
    }



    /**
     * Setting connection with SmartContract: KeyManager
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
        let key = await contract.getValue();
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
      * Senden der eigenen Kryptoadresse an Server.
      * Rückerhalt vom neu generierten Schlüssel vom Server
      */
    const getPublicKeyFromServer = async () => {
        const ownerAddress = defaultAccount;

        try {
        const response = await fetch('http://localhost:5051/keymanager', {
            method: 'POST',
            headers: {
            'Content-Type': 'text/plain', // Setzen Sie den Content-Type auf text/plain
            },
            body: ownerAddress, // Übergeben Sie den String direkt im Body
        });
    
        if (!response.ok) {
            throw new Error('Fehler beim Senden der Daten');
        }
    
        const publicKey = await response.text(); // Lesen Sie den zurückgegebenen String
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
        contract.setValue(generatedKey);
    }


     /** KANN GELÖSCHT WERDEN
      * POST-Request to Server with publicKey
      */
     const sendPublicKeyToServer = async () => {
        const formData = new FormData();
        formData.append('publicKey', contractKey);
        
        try {
            const response = await fetch('http://localhost:5050/keymanager', {
            method: 'POST',
            body: formData,
        });
    
        if(!response.ok) {
            throw new Error('Fehler beim Senden der Daten');
        }
    
        console.log('Daten erfolgreich an den Server gesendet'); 
        } catch(error) {
            console.error('Fehler: ', error.message);
         }
    };
   

    return (
        <div>
            <button onClick={connectWalletHandler}>Click to see logged Crypto-account</button>
            <p>Address: {defaultAccount}</p>

            <button onClick={getKeyFromBlockchain}>Check Key from Blockchain</button>
            <p>Public-Key on Blockchain:</p>
            <textarea rows={5} cols={50} value={contractKey} readOnly></textarea> <br/>

            <button onClick={generateKeys}>click to generate your keys</button> <br />
            <p>private key saves localy as private.pem with public.pem, which gets load on Blockchain</p> <br/>
            <p>Generated publicKey: {generatedKey}</p>
            <button onClick={sendGeneratedKeyToBlockchain}> Click to safe key on Blockchain</button>
        </div>
    );
}


export default KeyManager;

