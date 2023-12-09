import React, {useState} from 'react'
import {ethers} from 'ethers'

import forge from 'node-forge';


import RSAPublicKeyRegistry_abi from './contracts/RSAPublicKeyRegistry_abi.json';




//Erstelle hier nun die Schlüsselerstellung mit Upload Funktionalität

function KeyRegistry() {


    const [publicKey, setPublicKey] = useState("");
    const [privateKey, setPrivateKey] = useState("");

    // Generiere Schlüsselpaar
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });  
    const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    

    const generateKeys = () => {
        setPublicKey(publicKeyPem);
        setPrivateKey(privateKeyPem);
        //setData(encryptedData);
        //setDecrypted(decryptedData);
      }


    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");

    //Tests
    const [contractKey, setContractKey] = useState("");
    const [defaultAccount, setDefaultAccount] = useState("");

    //RSAPublicKeyRegistry Address
    let contractAddress = "0x5F163f8D7922e9C9A5ED347656eD0f8C08f5D8b4";

    const keyHolder = "1234KeyKeyMa2";

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

    const keyRegistration = async () => {
        let tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, RSAPublicKeyRegistry_abi, tempSigner);
        setContract(tempContract);
    }

    //Schreibe Key
    const setKey = () => {
        if (publicKey != ""){
            contract.setRSAPublicKey(publicKey);
        }     
    }
    
    //Ausgabe Public Key für logged Adresse
    const getKey = async () => {
        //let key = await contract.getRSAPublicKey();
        
        //Test kriegt warum auch immer leeren Wert zurück
        let key = await contract.getOtherKey();

        setContractKey(key);
        console.log("Zugriff auf externe Key erfolgreich, fehler liegt am Address-String Problem");
        //setPrivateKey(key);
    }


    return (
        <div>
            <button onClick={connectWalletHandler}>Connect with MetaMask</button>
            <p>logged crypto address: <br/>{defaultAccount}</p>

            <p>1. click generate Key, <br/> 2. click send key to saving your public key for crypto Docs</p>
            <button onClick={getKey}>Check if you already got a Public Key for CryptoDocs</button>
            <p>Your Public Key on Blockchain: </p> <br />
            <textarea rows={5} cols={50} value={contractKey} readOnly/> <br/>
            
            <button onClick={generateKeys}>click to generate your keys</button> <br />
            <p> Public Key: </p>
            <textarea rows={5} cols={50} value={publicKey} readOnly/> <br/>
            <button onClick={setKey}>Save on Blockchain</button>
            
            <p>Save your own Private Key: </p>
            <textarea rows={5} cols={50} value={privateKey} readOnly/> <br />
        </div>
    )
}

export default KeyRegistry;