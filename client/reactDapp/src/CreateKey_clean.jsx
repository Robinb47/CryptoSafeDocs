import React, { useState } from 'react';
import RSAPublicKeyRegistry_abi from './contracts/RSAPublicKeyRegistry_abi.json';
import { ethers } from 'ethers';

import forge from 'node-forge';


function CreateKey_clean() {


    let contractAddress = '0x2359Fa4bCC9fBA1F1F38fdE037681891a5d0AC85';
    //const contractABI = RSAPublicKeyRegistraty_abi;

    const [userAddress, setUserAddress] = useState("");

    const saveKeyOnBlockchain = async (publicKey) => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];
    }

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
        </div>
    )
}

export default CreateKey_clean;