import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers'
import forge from 'node-forge';

//import RSAPublicKeyRegistry_abi from './contracts/RSAPublicKeyRegistry_abi.json';
import { setegid } from 'process';

import KeyManager_abi from './contracts/KeyManager_abi.json';


function Decrypter() {
    
    const [provider, setProvider] = useState("");
    const [signer, setSigner] = useState("");
    const [contract, setContract] = useState("");
    const contractAddress = "0x1A14eee7aD1Ee355d28B61bdea18e2cBCb308DBC";

    //MetaMask interaction
    const [defaultAccount, setDefaultAccount] = useState("");

    const [decryptedMessage, setDecryptedMessage] = useState("nothing decrypted yet");
    //const [privateKey, setPrivateKey] = useState("Paste your PrivateKey here");

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

    const decryptIpfs = () => {
        const privateKey = `-----BEGIN RSA PRIVATE KEY-----
        MIIEowIBAAKCAQEAlS8sZA46MAxi6IDujAF9pkcv2tpR3NnG6BMejqUXrFxNP8nK
        qWtXA1oE5LDC/WilohNs08lQlux85Ru9aR81BvMKKSXM2L5dmLcN9T9UjZcys8av
        wB8fXpvAR0+XYwnV6lsLgOBOHXX4zku4uI8CHUrgCrwFKHlCZofNMwEl2it/M12p
        sKN5tG1a5iorh9jt71G6gTNGT5Xo4kUHmDnUQBelxyRa/hwaGeMNBR41OQrIZvDd
        TW8q8iO8ia3u3kqwp2j/09JdwANjWHOGJ7d+C/OpSKy5zV6JoBfKaCt92gZ1zF+u
        gRX8kHXocAS/lnjVRcgxxduf/3pz3ND/6acbKwIDAQABAoIBACET05DfwrESnf+V
        Ts8GKZjrocWxsIL6WmrsilLwcf5KfOpO0LudzC43EGywcJuFT2xPSErxEQhVqR+X
        dfjP7Y775l3XPsMz+ka5F8Qv5Yx7YMeRnzhG7kqo2Ao3sIZKEP8kbrmFgmxv0tnS
        2kM5mitqhaB7rd0afcmEBNBxSbZEpc78HIpGjqF5Sd9XyPsF1/+9gPPeMBz5eUXo
        X4tyfgXxMeBkdGxyPl/0Z7SN+5RGdWAC8OEUUN1XXx/mEdP6UW7qyxT+dgxQfnhJ
        tCMkSpSMI35jpTaaQQ6pupwecW9Kkd9ASPu39JnG6Agbay7r3snMdouKGAM7LFhY
        JHs86/ECgYEA0dPDfL0/o56aLL9xc1GvQ3uIF/8AW3yerSmcPUtGfGSQWeZcTJOF
        Wu3eyiXqDPxwmNSkYn0CWhKb+xAXggVXqrPBzX8y4/w2wEdk1T6g8yuh8R/UbPnC
        QMaOsG8wGRDhJXdCRqclrrHDUN8DCLbQUs/jXQ2nrKYkaaZ+8ujMo/MCgYEAtgMz
        KCJkS8UITv8tIV+1OzkBu/6ce1HsvxshO7ClutM1jepuFkIFh1+xUvCUgUVki/MM
        bKY6SjYCrrmkNPbBbDeeEhykfvLGlJI+VsOyNzaq5gI1EDNM8Pme7LvHIWLFNRlV
        /S1gVApu1qeMloof0gttRcDgiiGpV8pjFwniUekCgYEAqoHy8YK4HDXeA07u2k8e
        pS/VP+qwV6fFKeIOXKC2/o6Z3vQbPP8D9wglaw+0Sik5NnhVvNLo/ljw9+vzrmy4
        +LZqXptmt21U8JsTjVX/ZJuoVVEQRh4PhKPVf/pak4Pr8Y4gBVn+fR9nIGiZBpPI
        ZgMZN5zJDLtWC6SItMwIv5ECgYA2h0riMTt+/653jDdHEldHQNLmMWdMAsU8k7In
        Icrk57XZqGwGuwzQ+7gyMuUqvVFcJBqKyloYNYokMnWhcHOOKjNvFamqZq1bgVyv
        vb08kWItumePTO82GnKkVbVYqTCPseFzEg8T3nRKVrPlvce+s7Gu/hPHDkKfjICX
        PFzTUQKBgC6X66aqBsb/PWXtuJN83/eG3DE31z2jRzwziUOP5pHx7wPICmU74B7G
        tg4XR9BK5Wl5VoibJLMT9kSZP1z/6QZoXUaZPkB93bZMAyWsT/9Ts4jur0QshocG
        STbD7rHvqha9+IOh+LQghSt+Fu4B7tG0YSII0SAFLaCHhqjd5DcU
        -----END RSA PRIVATE KEY-----
        `;

        //setDecryptedMessage(privateKey);

        const encryptedLink = "Jgmg7INfx0rRFZ8ZyR9p2awDnBocYjzOn/QacdXIVdBoX2APwqTtB//OGgN8V9Jnp0VW3P1hknzaSjGX+bVoTRTGijMpBbI8r6hwIfyvUXmNU+uYxfPnDiHXG2R66qkOOZ6wXanmT5hn5AD+Alg2OXyn6+z9d1Tg8cTyW03UpCWhEzMVpdAHnESIjDM1LYSKe/inHn+RWENhwYPeStCejOSlaNuqnUEm+pTlG9bHwyjI220W0hI5xo8Zdig9WCWCfQ4IfiABSjAGY6F2PPPHeyCSrP6oLg+EcIulsyFYivu+IejTF3Xwlf3Lmkfes03QUe397PqP4c31tdPH6l5juw==";
        //const encryptedValueBuffer = Buffer.from(encryptedLink, 'base64');
        //const arrayBuffer = Uint8Array.from(atob(encryptedLink), c => c.charCodeAt(0)).buffer;

        //Dekodiere Base64-kodierte Zeichenkette
        const decodedLink = atob(encryptedLink);

        const decryptedBuffer = crypto.privateDecrypt({ key: privateKey, padding: RSA_PKCS1_PADDING }, Buffer.from(decodedLink, 'binary'));
        const decryptedValue = decryptedBuffer.toString('utf-8');

        setDecryptedMessage(privateKey);
     
        
        //const decryptedBuffer = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, arrayBuffer);
        //const decryptedValue = decryptedBuffer.toString('utf-8');
        setDecryptedMessage(privateKey);
    }


    return (
        <div>
            <button onClick={decryptIpfs}>Click here to decrypt</button>
            <p>{decryptedMessage}</p>
        </div>
    );
}

export default Decrypter;