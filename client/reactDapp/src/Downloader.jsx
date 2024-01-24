import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers'
//import forge from 'node-forge';

//import RSAPublicKeyRegistry_abi from './contracts/RSAPublicKeyRegistry_abi.json';
//import { setegid } from 'process';

//import EncryptedLinks_abi from './contracts/EncryptedLinks_abi.json';
//import { on } from 'events';

import KeyAndLinkMananger_abi from './contracts/KeyAndLinkManager_abi.json';

function Downloader() {

    //Erweiterung für Smart Contract Interaktion
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");
    const [encryptedDocument, setEncryptedDocument] = useState("");
    const [decryptedDocument, setDecryptedDocument] = useState(""); 
    const [defaultAccount, setDefaultAccount] = useState("");

    let contractAddress = "0x5dcD32D9F30999D537695B2029579481540392e2";
    
    //ich wollte dies im Hintergrund mit folgenden Code laufen lassen, es buggt dann aber leider 
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

        let tempContract = new ethers.Contract(contractAddress, KeyAndLinkMananger_abi, tempSigner);
        setContract(tempContract);
    }


    const getCryptedLink = async () => {
        let encryptedLink = await contract.getDocument();
        setEncryptedDocument(encryptedLink);
    }

    //OG Version
    const handleDecryption = async () => {
        //const formData = new FormData();
        let encrypted = await contract.getDocument();
        //let encrypted = "hallo";
       // formData.append('encryptedDocument', encrypted);
        console.log("verschlüsselter Hashwert: ", encrypted);

        fetch('http://localhost:5052/download', {
            method: 'POST',
            body: encrypted,
            headers: {
                'Content-Type': 'text/plain',
            }
            })
            .then((response) => {
                if (response.ok) {
                   // setDecryptedDocument(response.text());
                    return response.text();
                } else {
                    console.error('Error decrypting the Document ');
                    throw new Error('Download failed');
                }
            })
            .then((decryptedText) => {
                //Hier setzt du den entschlüsselten Text ein
                setDecryptedDocument(decryptedText);
            })
            .catch((error) => {
                //Handle Fetch error
                console.error('Fetch error:', error);
            });
    }

    //passage Version mit WebAuthn
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
                //Hier setzt du den entschlüsselten Text ein
                setDecryptedDocument(decryptedText);
            })
            .catch((error) => {
                //Handle Fetch error
                console.error('Fetch error:', error);
            });
    }

    //PassageAuthTest
    const handlePassage = async () => {

        fetch('http://localhost:5052/authenticatedRoute', {
            method: 'POST',
            body: "hallo",
            headers: {
                'Content-Type': 'text/plain',
            }
        });

    }

    return (
        <div>
            <button onClick={connectWalletHandler}>show crypto-account</button>
            <p>Address: {defaultAccount}</p>

            <button onClick={getCryptedLink}>click to see saved document on Blockchain</button>
            <p>encrypted Document: {encryptedDocument}</p>

            <button onClick={handleDecryptionPassage}>click to decrypt ipfs-Link</button>
            <p>decrypted IPFS-Link: {decryptedDocument}</p>

            <button onClick={handlePassage}>Try Passage SDK</button>
        </div>
    );
    
}

export default Downloader;