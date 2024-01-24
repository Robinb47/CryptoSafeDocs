/*
const Moralis = require("moralis").default;
const fs = require("fs");
*/

const express = require('express');
const bodyParser = require("body-parser");
const multer = require("multer");
const Moralis = require("moralis").default;
const fs = require("fs");
const cors = require('cors');


const encrypt = require('./encrypt');

//hier kommt die Erweiterung für die Verschlüsselung
const secp256k1 = require('secp256k1');
const crypto = require('crypto');
const NodeRSA = require('node-rsa');

//Generate an RSA key pair
//const key = new NodeRSA({b: 512});


const app = express();
const port = 5050;

app.use(cors());

app.use(bodyParser.json());
const upload = multer({ dest: "uploads/" });

Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU2N2JiMWRmLWNkZjktNDU1OS1hZDFjLTRjYTIxNDkzZjQ0YiIsIm9yZ0lkIjoiMzU5MTQwIiwidXNlcklkIjoiMzY5MDk3IiwidHlwZUlkIjoiYjZhOGNiMjYtMDNiOC00ZGJkLTljZDMtNjk0YTE3MDIyZGU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTU5NzIwMTgsImV4cCI6NDg1MTczMjAxOH0.r1_76F07nsbUFxAoEBHv446YL3z2rw5h3c-ASG3gKto"
});

app.post("/upload", upload.single("pdf"), async (req, res) => {
    try {
        // Hochgeladene PDF-Datei lesen
        const filePath = req.file.path;
        const content = fs.readFileSync(filePath, { encoding: "base64" });

        //hochgeladene Liste lesen
        const recipientKey = req.body.recipientKey;
        console.log("That is the Public Key from the recipient: ", recipientKey);

        const uploadArray = [
            {
                path: filePath,
                content: content
        }]

        // Auf IPFS hochladen
        const response = await Moralis.EvmApi.ipfs.uploadFolder({
            abi: uploadArray,
        });

        // IPFS-Link auf der Konsole ausgeben
        console.log("IPFS-Link:", response.result);

        let ipfsPath = response.result[0].path.toString();
        console.log("gefilterter Ipfs-Link: ", ipfsPath);
        
        // Verschlüsselter IPFS-Link 
        const encryptedBuffer = crypto.publicEncrypt({ key: recipientKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(ipfsPath, 'utf-8'));
        const encryptedString = encryptedBuffer.toString('base64');

        console.log('verschlüsselter IPFS-Link als Buffer: ', encryptedBuffer);
        console.log('verschlüsselter IPFS-Link als String: ', encryptedBuffer.toString('base64'));
  
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
        -----END RSA PRIVATE KEY-----`;

        //console.log('Ist Base64:', isBase64(encryptedString));
        //const decryptedBuffer = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, encryptedBuffer);
        //const decryptedValue = decryptedBuffer.toString('utf-8');
        
        //const decryptedBuffer = crypto.privateDecrypt( { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },  Buffer.from(encryptedString, 'base64'));
        
        let key = privateKey;
        //const decrypted = key.decrypt(encryptedString, 'utf-8');
        
        //const decryptedBuffer = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(encryptedBuffer, 'utf-8'));
        const decryptedBuffer = crypto.privateDecrypt(
            {
              key: privateKey,
              padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            encryptedBuffer
          );
        const decryptedValue = decryptedBuffer.toString('utf-8');
        console.log("ENTSCHLÜSSELT: ", decryptedValue);

        console.log("Hier hast du den ENTSCHLÜSSELTEN IPFS-Link: ", decryptedValue);

        /*
        const encryptedIpfsLink = crypto.publicEncrypt(
            {
                key: accessList,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(ipfsPath, 'utf8')
        );
        */
        //const publicKey = accessList;
        //const publicKeyString = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
        /*
        const publicKeyString = `-----BEGIN PUBLIC KEY-----
        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAisnU7y/fahyzshbCMxAD
        ojynQkFwDawOfZ6mfGPcf6IJLX4v7A6aduQmMNCBMSG8cmfJ3b+9Y1pg58C0hLgD
        0ixzgmpz1gEenbdu5U9Xt/X+qs6LI7oFDFoojBgn4RqjQNZ5V1XQwNfLtL6Wf9tf
        WCmHFOrhOC2tVWLyVc5CME5RsxV0D/CHhDLhGNJexNqU618w2TT3N1qoSQJY/+CE
        SoCa0cCsSgS4lr1WScUl+UF4faf8birODYjIAweF78Xrs/rdg6pBrDqN4ZV+em2M
        upbs4kxN/JMtT+cdUJKFnL2M9ksbJDqWOy59n2wE+fbf8VHOMZ9xFYaaodUSbFvi
        bwIDAQAB
        -----END PUBLIC KEY-----`;
        console.log(publicKeyString);
        const key = new NodeRSA();
        key.importKey(publicKeyString, 'pkcs8-public-pem');
        const encryptedLink = key.encrypt(ipfsPath, 'base64');
        console.log('encrypted Ipfs Link: ', encryptedLink);
        //console.log("verschlüsselte Nachricht: ", encryptedIpfsLink.toString('base64'));
        */

        res.send(ipfsPath);
        
    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

app.listen(port, () => {
    console.log(`Der Server läuft auf Port ${port}`);
});

