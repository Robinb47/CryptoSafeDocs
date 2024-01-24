const express = require('express');
const bodyParser = require("body-parser");
const multer = require("multer");
const Moralis = require("moralis").default;
const fs = require("fs");
const cors = require('cors');
//NEU
const Passage = require("@passageidentity/passage-node");

//hier kommt die Erweiterung für die Verschlüsselung
const crypto = require('crypto');
const NodeRSA = require('node-rsa');

//Generate an RSA key pair
const key = new NodeRSA({b: 512});

const app = express();
const port = 5052;

//app.use(cors());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); 
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Authorization'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); 
    if (req.method === 'OPTIONS') {
      // Sendet eine sofortige Antwort für OPTIONS-Anfragen
      return res.sendStatus(200);
    }
    next();
  });

//Versuch Cors als Sicherheitsmechanismus zu verwenden
//http://localhost:5173 als einzige mögliche Domain

app.use(bodyParser.json());
const upload = multer({ dest: "uploads/" });

Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU2N2JiMWRmLWNkZjktNDU1OS1hZDFjLTRjYTIxNDkzZjQ0YiIsIm9yZ0lkIjoiMzU5MTQwIiwidXNlcklkIjoiMzY5MDk3IiwidHlwZUlkIjoiYjZhOGNiMjYtMDNiOC00ZGJkLTljZDMtNjk0YTE3MDIyZGU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTU5NzIwMTgsImV4cCI6NDg1MTczMjAxOH0.r1_76F07nsbUFxAoEBHv446YL3z2rw5h3c-ASG3gKto"
});

//Konfiguration für Passage noch PASSAGE_APP_ID anpassen
const passageConfig = {
    appID: "swni5tN408lF8CQAWVwxli4d",
    authStrategy: "HEADER",
};

let passage = new Passage(passageConfig);
let passageAuthMiddleware = (() => {
    return async (req, res, next) => {
        try {
            let userID = await passage.authenticateRequest(req);
            if (userID) {
                res.userID = userID;
                next();
            }
        } catch (PassageError) {
            console.log(PassageError);
            res.status(401).send('Could not authenticate user!');
        }
    }
})();
//alles obige neu ergänzt für Passage Authorisierung


app.post("/upload", passageAuthMiddleware, upload.single("pdf"), async (req, res) => {
    try {
        // Hochgeladene PDF-Datei lesen
        const filePath = req.file.path;
        const content = fs.readFileSync(filePath, { encoding: "base64" });

        //hochgeladene Liste lesen
        const recipientKey = req.body.recipientKey;
        console.log("Das ist der erhaltene Key von der Blockchain: ", recipientKey);

        const uploadArray = [
            {
                path: filePath,
                content: content
        }]

        const response = await Moralis.EvmApi.ipfs.uploadFolder({
            abi: uploadArray,
        });

         // IPFS-Link auf der Konsole ausgeben
         console.log("IPFS-Link:", response.result);

         let ipfsPath = response.result[0].path;
         console.log("gefilterter Ipfs-Link: ", ipfsPath);

         //const publicKeyFile = fs.readFileSync('/Users/robinb47/SafeDoc/server/Download/public.pem', 'utf-8');
        //const publicKeyFile = fs.readFileSync('/Users/robinb47/SafeDoc/server/Download/public.pem', 'utf-8');
        //const privateKeyFile = fs.readFileSync('/Users/robinb47/SafeDoc/server/Download/private.pem', 'utf-8');


        key.importKey(recipientKey, 'public');
       // key.importKey(privateKeyFile, 'private');

        const encryptedMessage = key.encrypt(ipfsPath, 'base64');
        console.log('encrypted: ', encryptedMessage);

        res.send(encryptedMessage);
        //const decryptedMessage = key.decrypt(encryptedMessage, 'utf-8');
        //console.log("Das ist die entschlüsselte Nachricht: ", decryptedMessage);

    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

      //const privateKeyFile = fs.readFileSync('/Users/robinb47/SafeDoc/server/Download/private.pem', 'utf-8');
        //const publicKeyFile = fs.readFileSync('/Users/robinb47/SafeDoc/server/Download/public.pem', 'utf-8');

       // key.importKey(publicKeyFile, 'public');
       // key.importKey(privateKeyFile, 'private');
        //const decryptedDocument = key.decrypt(encryptedDocument, 'base64');
        //console.log('Encrypted IPFS-Link: ', decryptedDocument);

//TO-DO: Implementierung eines POST-Request
//Erhalte eine Zeichenfolge = String verschlüsselter IPFS-Hash

app.use(express.text());


//hier unten wurde passageAuthMiddleware ergänzt
app.post("/download", passageAuthMiddleware, async (req, res) => {
    try {
        const encryptedDocument = req.body;
        console.log("Das ist der erhaltene verschlüsselte IPFS-Link:", encryptedDocument);

        const privateKeyFile = fs.readFileSync('/Users/robinb47/SafeDoc/server/Download/private.pem', 'utf-8');
        const publicKeyFile = fs.readFileSync('/Users/robinb47/SafeDoc/server/Download/public.pem', 'utf-8');
        key.importKey(privateKeyFile, 'private');
        //key.importKey(publicKeyFile, 'public');
        
        const decryptedDocument = key.decrypt(encryptedDocument, 'utf-8');
        console.log('Decrypted IPFS-Link: ', decryptedDocument);

    } catch (error) {
        console.error("Fehler", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

app.listen(port, () => {
    console.log(`Der Server läuft auf Port ${port}`);
});