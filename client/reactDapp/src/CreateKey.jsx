import React, { useState } from 'react';
import RSAPublicKeyRegistry_abi from './contracts/RSAPublicKeyRegistry_abi.json';
import { ethers } from 'ethers';

import forge from 'node-forge';


function CreateKey() {

    //Alles für Smart Contract
    //const [generatedKey, setGeneratedKey] = useState("");
    const [transactionHash, setTransactionHash] = useState("");
    //const [ethersProvider, setEthersProvider] = useState(null);
    const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

    //Tests
    const [contractKey, setContractKey] = useState("");
    const [defaultAccount, setDefaultAccount] = useState("");



    let contractAddress = '0x2359Fa4bCC9fBA1F1F38fdE037681891a5d0AC85';
    //const contractABI = RSAPublicKeyRegistraty_abi;

    const saveKeyOnBlockchain = async (publicKey) => {

        if (window.ethereum && window.ethereum.isMetaMask) {
    
            window.ethereum.request({ method: 'eth_requestAccounts'})
                .then(result => {
                   setDefaultAccount(result[0]);
                })
            } else {
                console.log('Need to install MetaMask'); 
                //setErrorMessage('Please install MetaMask browser extension to interact');
            }
       
       
            try {
                let tempProvider = new ethers.BrowserProvider(window.ethereum);
                setProvider(tempProvider);
    
                let tempSigner = await tempProvider.getSigner();
                setSigner(tempSigner);
    
                let tempContract = new ethers.Contract(contractAddress, RSAPublicKeyRegistry_abi, tempSigner)
                setContract(tempContract);
    
                //Annahme: setRSAPublicKey
                const transaction = await contract.setRSAPublicKey(publicKey);


    
        
            /*
            const updateEthers = async () => {
            let tempProvider = new ethers.BrowserProvider(window.ethereum);
            setProvider(tempProvider);

            let tempSigner = await tempProvider.getSigner();
            setSigner(tempSigner);

            let tempContract = new ethers.Contract(contractAddress, RSAPublicKeyRegistry_abi, tempSigner)
            setContract(tempContract);

            //Annahme: setRSAPublicKey
            const transaction = await contract.setRSAPublicKey(publicKey);

            */
    }
            /*
            //Verbinde mit Smart Contract
            const contract = new ethers.Contract(contractAdress, contractABI, ethers.Provider.getSigner());

            //Annahme: setRSAPublicKey
            const transaction = await contract.setRSAPublicKey(publicKey);

            //Abwarten auf Bestätigung
            await transaction.wait();

            // Setze Transaktionshash, um ihn anzuzeigen oder weiterzuverarbeiten
            setTransactionHash(transaction.hash);
            */
         catch (error) {
            console.error("Fehler beim Speichern des Schlüssels: ", error);
        }
    };


    ///
    const [publicKey, setPublicKey] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [data, setData] = useState("");
    const [decrypt, setDecrypted] = useState(""); 
  
    // Generiere Schlüsselpaar
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });  
    const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
  
    // Beispiel für Verschlüsselung
    const dataToEncrypt = 'Hallo, Welt!';
    const encryptedData = forge.pki.publicKeyFromPem(publicKeyPem).encrypt(dataToEncrypt, 'RSA-OAEP');
  
    // Beispiel für Entschlüsselung
    const decryptedData = keyPair.privateKey.decrypt(encryptedData, 'RSA-OAEP');
  
    //hier vllt Schlüssel über Smart Contract senden
    //MetaMask einbinden wie in WalletAuth
  
    const generateKeys = () => {
      setPublicKey(publicKeyPem);
      setPrivateKey(privateKeyPem);
      setData(encryptedData);
      setDecrypted(decryptedData);
    }

    const getKeyTester = () => {
        let contractKeyTest = contract.getRSAPublicKey();
        setContractKey(contractKeyTest);
    }

    return(
        <div>
            <button onClick={generateKeys}>Schlüssel generieren</button>
            <p>Public Key: {publicKeyPem}</p>
            <p>Private Key: {privateKeyPem} </p>
            <button onClick={saveKeyOnBlockchain}>Load public key on Blockchain</button>
            <button onClick={getKeyTester}>Show saved key on blockchain: {contractKey}</button>
            <p>Hier ist der angemeldete Account: {defaultAccount}</p>
        </div>
    )
}

export default CreateKey;