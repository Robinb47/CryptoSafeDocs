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
const crypto = require('crypto');
const secp256k1 = require('secp256k1');


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
        let firstAccess = accessList[0];
        console.log("erster Access Wallet: ", firstAccess);
        
        const encryptedIpfsLink = crypto.publicEncrypt(
            {
                key: firstAccess,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(message, 'utf8')
        );

        console.log("verschlüsselte Nachricht: ", encryptedIpfsLink.toString('base64'));

        res.send(ipfsPath);
    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

app.listen(port, () => {
    console.log(`Der Server läuft auf Port ${port}`);
});

