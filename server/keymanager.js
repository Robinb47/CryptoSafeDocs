/*
const Moralis = require("moralis").default;
const fs = require("fs");
*/

const NodeRSA = require('node-rsa');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const Passage = require("@passageidentity/passage-node");

const crypto = require('crypto');


const app = express();
const port = 5051;

app.use(cors());

app.use(express.text());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Erlaubt Anfragen von dieser Ursprungsdomain
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Authorization'); // Erlaubt den Authorization-Header
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Erlaubt bestimmte Methoden
    if (req.method === 'OPTIONS') {
      // Sendet eine sofortige Antwort für OPTIONS-Anfragen
      return res.sendStatus(200);
    }
    next();
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

// Funktion zum Generieren von RSA-Schlüsselpaaren
function generateKeyPair() {
    const key = new NodeRSA({ b: 2048 }); // 2048-Bit-Schlüssel, Sie können dies je nach Anforderung ändern
    const privateKey = key.exportKey('pkcs1-private');
    const publicKey = key.exportKey('pkcs8-public');
  
    // Speichern Sie den privaten Schlüssel im Download-Ordner
    const privateKeyPath = path.join(__dirname, 'Download', 'private.pem');
    fs.writeFileSync(privateKeyPath, privateKey, 'utf8');
  
    // Speichern Sie den öffentlichen Schlüssel im Download-Ordner
    const publicKeyPath = path.join(__dirname, 'Download', 'public.pem');
    fs.writeFileSync(publicKeyPath, publicKey, 'utf8');
  
    console.log('RSA-Schlüsselpaar erfolgreich generiert und Schlüssel gespeichert.');

    return publicKey;
}

app.post('/keymanager', (req, res) => {
    const ownerAddress = req.body;
    console.log('Empfangene ownerAddress:', ownerAddress);
  
    let key = generateKeyPair();

    // create public key
    const publicKey = key;
    console.log("Der erstellte IPFS-Link: ", publicKey);
  
    // Senden des  öffentlichen Schlüssel als Text an das Frontend
    res.send(publicKey);
  });

app.listen(port, () => {
    console.log(`Server läuft auf http:localhost:${port}`);
});
