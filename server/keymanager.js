/*
const Moralis = require("moralis").default;
const fs = require("fs");
*/

const NodeRSA = require('node-rsa');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

//const encrypt = require('./encrypt');

//hier kommt die Erweiterung für die Verschlüsselung
//const secp256k1 = require('secp256k1');
const crypto = require('crypto');


const app = express();
const port = 5051;

app.use(cors());

app.use(express.text());


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
  
    // Hier können Sie weitere Operationen mit ownerAddress durchführen
    let key = generateKeyPair();


    // Beispiel: Erstellen Sie einen öffentlichen Schlüssel
    const publicKey = key;
    console.log("Der erstellte IPFS-Link: ", publicKey);
  
    // Senden des  öffentlichen Schlüssel als Text an das Frontend
    res.send(publicKey);
  });

app.listen(port, () => {
    console.log(`Server läuft auf http:localhost:${port}`);
});
