/*
const Moralis = require("moralis").default;
const fs = require("fs");
*/

const express = require('express');
const bodyParser = require("body-parser");
const multer = require("multer");
const Moralis = require("moralis").default;
const fs = require("fs");

const app = express();
const port = 5050;

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
        res.json({ ipfsLink: response.result });
        console.log("IpfsLink an Server gesendet")
    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

app.listen(port, () => {
    console.log(`Der Server läuft auf Port ${port}`);
});
