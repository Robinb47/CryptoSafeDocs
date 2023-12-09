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
        const accessList = req.body.accessList;
        console.log("That is your accessList: ", accessList);

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

        // Den IPFS-Link an das Frontend zurückschicken
        //res.json({ ipfsLink: response.result });
        //console.log("IpfsLink an Server gesendet: ", response.result);
        let ipfsPath = response.result[0].path.toString();
        console.log("gefilterter Ipfs-Link: ", ipfsPath);
        
        //versuch ipfs hash mit public key über secp256k1 zu verschlüsseln
        console.log("erster Access Wallet: ", accessList);
        
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
        
        //key.importKey(privateKey, 'pkcs8-private-pem');

    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

app.listen(port, () => {
    console.log(`Der Server läuft auf Port ${port}`);
});

