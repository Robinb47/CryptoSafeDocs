import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers'
import forge from 'node-forge';

//import RSAPublicKeyRegistry_abi from './contracts/RSAPublicKeyRegistry_abi.json';
import { setegid } from 'process';

import EncryptedLinks_abi from './contracts/EncryptedLinks_abi.json';
import { on } from 'events';


function Download() {

    //Erweiterung für Smart Contract Interaktion
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");


    let contractAddress = "0x3997752EC40667D334cbf7824566B05C284364bA";

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

        let tempContract = new ethers.Contract(contractAddress, EncryptedLinks_abi, tempSigner);
        setContract(tempContract);
    }


    const getLink = async () => {
        let key = await contract.getEncryptedLink();
        
    }
      


}

export default Download;