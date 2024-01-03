import React, {useState} from 'react'
import {ethers} from 'ethers'

import forge from 'node-forge';


import RSAPublicKeyRegistry_abi from './contracts/RSAPublicKeyRegistry_abi.json';

import KeyManager_abi from './contracts/KeyManager_abi.json';



function KeySafer() {

    const [text, setText] = useState("none");

    //Smart Contract interaction
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");
    const contractAddress = "0x1A14eee7aD1Ee355d28B61bdea18e2cBCb308DBC";


    //MetaMask interaction
    const [defaultAccount, setDefaultAccount] = useState("");

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


    const contractConnect = async () => {
        let tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, KeyManager_abi, tempSigner);
        setContract(tempContract);
    }


    /*
    const StringWriter = async () => {
        let tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, StringGetter_abi, tempSigner);
        setContract(tempContract);
    }
    */


    const setString = () => {
        let value = "";
        const longString = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

        contract.setValue(longString);
    }

    const getString = async () => {
        let value = await contract.getValue();
        setText(value);

    }

    //Public Key creation 
    const [publicKey, setPublicKey] = useState("");
    const [privateKey, setPrivateKey] = useState("");

    const [bcKey, setBcKey] = useState("no key on Blockchain yet");

    const [receiverAccount, setReceiverAccount] = useState("no account");




    const generateKeys = () => {
        const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });  
        const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
        const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);

        setPublicKey(publicKeyPem);
        setPrivateKey(privateKeyPem);

    }

    const keySaver = () => {
        contract.setValue(publicKey);
    }

    const keyGetter = async () => {
        let key = await contract.getValue();
        setBcKey(key);

        let writer = await contract.getWriter();
        setReceiverAccount("kam an");
        //setReceiverAccount(typeof writer);

    }






    return(
        <div>
            <button onClick={connectWalletHandler}>connect with meta</button>
            <p>MetaMask Account: {defaultAccount}</p>

            <button onClick={keyGetter}>Click to get the current Blockchain-Value</button>
            <p>Blockchain-Key: </p>

            <textarea rows={5} cols={50} value={bcKey} readOnly/> <br />
            <p>Written by: {receiverAccount}</p>

            <p>If you want to receive a Document, override the key with yours on blockchain</p>
            <button onClick={generateKeys}>Click to generate keys</button>
            
            <p> Public Key: </p>
            <textarea rows={5} cols={50} value={publicKey} readOnly/> <br/>
            <button onClick={keySaver}>Save PublicKey below on Blockchain</button>


            <p>Save your own Private Key: </p>
            <textarea rows={5} cols={50} value={privateKey} readOnly/> <br />
       
        </div>
    );
}

export default KeySafer;