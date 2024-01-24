import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'

//Smart Contract abi import
import KeyAndLinkMananger_abi from './contracts/KeyAndLinkManager_abi.json';

function Downloader() {

     //set here your contract address after deploying via Remix
    let contractAddress = "0x5dcD32D9F30999D537695B2029579481540392e2";


    //Erweiterung für Smart Contract Interaktion
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");
    const [encryptedDocument, setEncryptedDocument] = useState("");
    const [decryptedDocument, setDecryptedDocument] = useState(""); 
    const [defaultAccount, setDefaultAccount] = useState("");

    
    //request connected crypto-wallet from MetaMask extension
    const connectWalletHandler = () => {
        window.ethereum.request({method: 'eth_requestAccounts'})
        .then(result => {
            accountChangedHandler(result[0]);
        })
    }

    /**
     * This method changes the requested account and repeats the connection with new account.
     */
    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        contractConnect();
    }

    //Smart Contract connection with contractAddress and abi
    const contractConnect = async () => {
        let tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, KeyAndLinkMananger_abi, tempSigner);
        setContract(tempContract);
    }

    //asking saved public key from recipient on blockchain
    const getCryptedLink = async () => {
        let encryptedLink = await contract.getDocument();
        setEncryptedDocument(encryptedLink);
    }

    /**
     * This method is asking the saved encrypted hash from blockchain.
     * The smart contract checks the address from user and returns his hash,
     * which has been setting before for him.
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
                Authorization: `Bearer ${authToken}`,
            },
            })
            .then((response) => {
                if (response.ok) {
                    setDecryptedDocument(decryptedText);
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
                //Handle Fetch error
                console.error('Fetch error:', error);
            });
    }

    return (
        <>
        <div style={{border: '2px solid black'}}>
            <h2> Downloader </h2>
            <button onClick={connectWalletHandler}>show crypto-account</button>
            <p>Address: {defaultAccount}</p>

            <button onClick={getCryptedLink}>click for document on Blockchain</button>
            <textarea rows={2} cols={30} value={encryptedDocument} readOnly></textarea> <br/>


            <button onClick={handleDecryptionPassage}>click to decrypt ipfs-Link</button>
            <textarea rows={2} cols={30} value={decryptedDocument} readOnly></textarea> <br/>
            <p>decrypted IPFS-Link: {decryptedDocument}</p>

        </div>
            <div>
              <h3> Go to Uploader or KeyGenerator </h3>
            </div>

        </>
    );
    
}

export default Downloader;