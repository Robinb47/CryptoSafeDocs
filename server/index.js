const express = require('express');
const bodyParser = require("body-parser");
const multer = require("multer");
const Moralis = require("moralis").default;
const fs = require("fs");
const cors = require('cors');
const Passage = require("@passageidentity/passage-node");

//for cryption
const crypto = require('crypto');
const NodeRSA = require('node-rsa');

// Generate an RSA key pair with a key size of 512 bits
const key = new NodeRSA({b: 512});

const app = express();
const port = 5052;

// Middleware to set CORS headers, allowing cross-origin requests from specified origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); 
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Authorization'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); 
    if (req.method === 'OPTIONS') {
    // Immediately respond to OPTIONS requests
      return res.sendStatus(200);
    }
    next();
  });

app.use(bodyParser.json());
const upload = multer({ dest: "uploads/" });

// Initialize Moralis SDK with your API key
Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU2N2JiMWRmLWNkZjktNDU1OS1hZDFjLTRjYTIxNDkzZjQ0YiIsIm9yZ0lkIjoiMzU5MTQwIiwidXNlcklkIjoiMzY5MDk3IiwidHlwZUlkIjoiYjZhOGNiMjYtMDNiOC00ZGJkLTljZDMtNjk0YTE3MDIyZGU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTU5NzIwMTgsImV4cCI6NDg1MTczMjAxOH0.r1_76F07nsbUFxAoEBHv446YL3z2rw5h3c-ASG3gKto" // Place your actual API key here
});

// Configuration for Passage authentication, adjust with your actual Passage app ID
const passageConfig = {
    appID: "swni5tN408lF8CQAWVwxli4d",
    authStrategy: "HEADER",
};

// Passage middleware to check the authorization token received from the client
let passage = new Passage(passageConfig);
let passageAuthMiddleware = (() => {
    return async (req, res, next) => {
        try {
            let userID = await passage.authenticateRequest(req);
            if (userID) {
                res.userID = userID; // Attach userID to the response object
                next();
            }
        } catch (PassageError) {
            console.log(PassageError);
            res.status(401).send('Could not authenticate user!');
        }
    }
})();

/**
 * Endpoint to receive a PDF file and public key from the recipient.
 */
app.post("/upload", passageAuthMiddleware, upload.single("pdf"), async (req, res) => {
    try {
        const filePath = req.file.path;
        const content = fs.readFileSync(filePath, { encoding: "base64" });

        // Verify the received public key
        const recipientKey = req.body.recipientKey;
        console.log("Das ist der erhaltene Key von vom Fronted und zuvor Blockchain: ", recipientKey);

        const uploadArray = [
            {
                path: filePath,
                content: content
        }]

        // Upload the file to IPFS using Moralis
        const response = await Moralis.EvmApi.ipfs.uploadFolder({
            abi: uploadArray,
        });

        // Log the IPFS link
         console.log("IPFS-Link:", response.result);

         let ipfsPath = response.result[0].path;
         console.log("gefilterter Ipfs-Link: ", ipfsPath);

        // Import the recipient's public key and encrypt the IPFS path
        const encryptKey = new NodeRSA();
        encryptKey.importKey(recipientKey, 'public');
        const encryptedMessage = encryptKey.encrypt(ipfsPath, 'base64');
        console.log('encrypted: ', encryptedMessage);

        // Send the encrypted IPFS path to the client
        res.send(encryptedMessage);

    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

app.use(express.text());


/**
 * Download endpoint: receives an encrypted IPFS document link from the client and decrypts it with the private key.
 */
app.post("/download", passageAuthMiddleware, async (req, res) => {
    try {
        const encryptedDocument = req.body;
        console.log("Das ist der erhaltene verschlüsselte IPFS-Link:", encryptedDocument);

        // Read the private key from a file
        const privateKeyFile = fs.readFileSync('/Users/robinb47/CryptoSafeDocs/server/Download/private.pem', 'utf-8');

        // Decrypt the document link
        const decryptKey = new NodeRSA();
        decryptKey.importKey(privateKeyFile, 'private');
        const decryptedDocument = decryptKey.decrypt(encryptedDocument, 'utf-8');
        console.log('Decrypted IPFS-Link: ', decryptedDocument); //log to check the decryption
        res.send(decryptedDocument); // Send the decrypted link back to the client

    } catch (error) {
        console.error("Fehler", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Der Server läuft auf Port ${port}`);
});