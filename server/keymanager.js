// Import necessary Node.js modules
const NodeRSA = require('node-rsa');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const Passage = require("@passageidentity/passage-node");
const crypto = require('crypto');

// Initialize the Express app
const app = express();
const port = 5051;

// Use CORS middleware for enabling cross-origin requests
app.use(cors());

// Use express.text() middleware to parse requests as plain text
app.use(express.text());

app.use((req, res, next) => {
    // Allows requests only from this origin
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); 
    res.header('Access-Control-Allow-Credentials', 'true');
    // Allows the Authorization header
    res.header('Access-Control-Allow-Headers', 'Authorization');
    // Allows specific methods
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); 
    if (req.method === 'OPTIONS') {
      // Sends an immediate response for OPTIONS requests
      return res.sendStatus(200);
    }
    next();
  });

// Configuration for Passage, adjust the PASSAGE_APP_ID accordingly
const passageConfig = {
    appID: "swni5tN408lF8CQAWVwxli4d",
    authStrategy: "HEADER",
};

// Initialize Passage with the specified config
let passage = new Passage(passageConfig);

// Middleware to authenticate requests using Passage
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

// Function to generate RSA key pairs
function generateKeyPair() {
    const key = new NodeRSA({ b: 2048 }); // 2048-bit key, can be adjusted as needed (at best 3072)
    const privateKey = key.exportKey('pkcs1-private');
    const publicKey = key.exportKey('pkcs8-public');
  
    // Save the private key in the Download folder
    const privateKeyPath = path.join(__dirname, 'Download', 'private.pem');
    fs.writeFileSync(privateKeyPath, privateKey, 'utf8');
  
    // Save the public key in the Download folder
    const publicKeyPath = path.join(__dirname, 'Download', 'public.pem');
    fs.writeFileSync(publicKeyPath, publicKey, 'utf8');
  
    console.log('RSA-Schlüsselpaar erfolgreich generiert und Schlüssel gespeichert.');

    return publicKey;
}

// Endpoint to manage key generation upon request
app.post('/keymanager', (req, res) => {
    const ownerAddress = req.body;
    console.log('Empfangene ownerAddress:', ownerAddress);
  
    let key = generateKeyPair();
    const publicKey = key;
    console.log("Der erstellte öffentliche Schlüssel: ", publicKey);
  
    // Sending the public key as text to the frontend
    res.send(publicKey);
  });

// Start the server
app.listen(port, () => {
    console.log(`Server läuft auf http:localhost:${port}`);
});
