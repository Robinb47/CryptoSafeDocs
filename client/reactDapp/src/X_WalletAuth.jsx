import React, { useState} from 'react';
import CryptoJS from 'crypto-js';
import {ethers} from 'ethers';
//import ABI
import { PassageUser } from '@passageidentity/passage-elements/passage-user';

//import detectEthereumProvider from '@metamask/detect-provider';
//import Ipfs from './Ipfs.jsx';
import Home from './Home'

function WalletAuth () {
    
    const [connButtonText, setConnectButtonText] = useState('Authenticated Wallet-Account');
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    //const selectedAccount = "";

    const [auth, setAuth] = useState(false);
    const [authButton, setAuthButton] = useState("no auth");

    /*
    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                //hier ist der springende Punkt
                setDefaultAccount(result[0]);

                /*if Bedingung für richtige Wallet
                -> ermittele wie ich auf Passage MetaDaten zugreife
                -> überprüfe walletAccount == passageAccount
                if()
                


                setConnectButtonText('selected crypto account: ' + defaultAccount + ' click to confirm');

                setConnectButtonText('crypto account selected' + defaultAccount);
                button.disabled = true;

                setDefaultAccount(newAccount);


            })
            .catch(error => {
                setErrorMessage(error.message);
            });
        } else {
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension');
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();
    }
    */
    const [passageAddress, setPassageAddress] = useState("show");
    const [mmAddress, setMmAddress] = useState("select");

    const getCryptoWallet = async () => {
        
        const user = new PassageUser();
        let userIn = await user.userInfo();
        userIn = JSON.stringify(userIn); 
        setPassageAddress(userIn);
    }

    const getPassageWalletAddress = async () => {
        const user = new PassageUser();
        let userInfoJson = await user.userInfo();
        let wallet = userInfoJson.user_metadata;
        let publicKey = wallet.public_key_of_wallet.toLowerCase();
        //console.log(publicKey);
        //window.alert(publicKey);
        setPassageAddress(publicKey);
        //setPassageUser warum bleibt no wallet login warum
    }

    getPassageWalletAddress;

    const getMmWallet = () => {

        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
        }

        if (window.ethereum && window.ethereum.isMetaMask) {
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                let walletAddress = result[0];
                setConnectButtonText(walletAddress);
                setMmAddress(walletAddress);
            })
        }

    }

    
    const authenticate = () => {
        if (passageAddress == mmAddress) {
            setAuth(true);
            setAuthButton("authenticated");
        }
        else{
            setAuthButton("open metamask extension and select cryptodocs address");
        }

    }
    

    // es muss noch eingebaut werden dass erkannt wird falls Account geändert wird
    // statt Button onload Funktion einbauen siehe auch MetaMask Docu als Beispiel


return (
    <div>
        <h3>Wallet-2-Authentification</h3>
        select your connected address for CryptoDocs
        <p> Accounts </p>
        <button onClick={getPassageWalletAddress}> CryptoDocs: {passageAddress} </button>
        <br></br>
        <button onClick={getMmWallet}> MetaMask: {mmAddress} </button> 
        <br></br>
        <button onClick={authenticate}> {authButton}</button>
    </div>
)

}
export default WalletAuth;