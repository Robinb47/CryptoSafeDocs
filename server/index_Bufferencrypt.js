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
        const keyString = JSON.stringify(recipientKey);
        console.log(keyString);
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

        let ipfsPath = response.result[0].path;
        console.log("gefilterter Ipfs-Link: ", ipfsPath);

        const encryptedBuffer = crypto.publicEncrypt(recipientKey, Buffer.from(ipfsPath, 'utf8'));
        console.log('verschlüsselte Daten: ', encryptedBuffer);
        console.log('verschlüsselter String: ', )
       
        //hier Funktion für verschlüsselung


        /*
        const privateKey = `-----BEGIN RSA PRIVATE KEY-----
        MIIEowIBAAKCAQEApuSG2pP1/52ZLWkapgJXJHt601wKzSI+3m2EknK5pzCZ1AO4
        U0TulOQprRF8hv87FeadUROrFjeLA+prsT6AOfZNYJQQhoyGjN75jyhzlpc8oLdC
        HhUvChGtfbbcx/WrF4JnINHCaWKq5XY1ltgwmJLzVmIOjxNBsNcpOsNXwPg4C8tg
        Vknl6edTU1vTjGy23ye2DTDnZhRifs59C/0EYn+7DkIej0jc0S0Wa9EpE5rEkTRv
        1EKApn7fcgabm86Cmncq1hGKEV2o8IrD2RWSGm5r67uvdJ4bBIvS5yZJ/aDmCU1M
        1xfjL64D5lRPJe+sbHBDtHjfmOHrptjop0ecgQIDAQABAoIBAEoRloAftsfxi/AJ
        e5g95ar9Wm+/o9OS5VAWTwYoAJlhCoR7+iyKpVBTSuPSpO/NCs4Xga5gCkhb8kiU
        m6MYWBRhacn5LLRqXbTbqOqOS26ERJYXfzKWuD/BxLvMkoP0VjCi4V5BegUHk00v
        f20pGbg9T94AuvFo3Hi9pUC9PY8YYaABuhMyLv0RF+CYfBG9oS2lpEn4Edm76OZH
        isKZ5Ha7DN5qIB7ATM1OmLQ5BhOw7JpPaJCt5EbyCYVr21B9pQE4fPc2NodDVoqF
        hFdpzI4+hRZyRZrDozlBgrA0HPzr0IjjBoTryxjNdoLwc7yhl1qaGcw0uVodRtJC
        YrEHI9kCgYEA7TlS4cgwv1yB/pSDEBy2XgmV8XY5QZsAF2HnNunh8WMp3ZD8lLG4
        M9VK96xO839aQ7evg5D1S/fk+pMI7aEbRJK5WMAmBFUdmdumZ4JeX4qiwKk7fEAZ
        jRAps6w9SukksUEUrfdPht5DMk9KssMMcXUokQdrlJ8+t05HGucvwsMCgYEAtBoj
        WRr9eiNIzlB5EVzctqEWda3UmglFzhPMfZ3Uz7afL2IQ+Ksg/aPbKrX84brYsi4Q
        8mNRPv1xLJuhPWw/nOKRh6m0RNr8dxlK0esbf9+iGL3iuTCZV/5gFJ44E3kGuo76
        7WtIkBnJdVRL08p4K1Cwuzpztfnp48gA2jxsp2sCgYBT7+WQuDnva/cfMkNRryck
        DPY+Mtu9h++3Vk/ukUD+HV1R5ZxJrLyFsqHNEu34oIY60cLLpb31vGgL9XzCQDAa
        ymPEsHCDNe68Ywj1NR7ZZX+C9h5zL2cbD64Bwh8J44a1JVcA2zILgZd7NK00pWlA
        t/i7oEmDk/kn+Q2VylmO6wKBgQCFS+cnluNOF3lWQZcpc5pjjNwrosl8bCp++IZb
        3onYZihxEFrRQQ78yt52QRV2GC0zywZ972X9geTWiCURaeG3ArWFO+QRJia/GzgW
        H7VNsj2tpDR+reqAhuOjvupv9x40y4gKWmHtTTienxI0IWFJZcI4AG4NnHcwQCHp
        Y9ljGwKBgAFQBfH/DqIyNOod7JVITsPKI77GDfxAabdw/+U0pvUcm2M/jyRcKRIG
        3hJwVmxJB+32ejrmNdslbvvT6bIg9TLmxF8naZP6amI0HQCaEfCALKUdBU9L8M9Y
        5lGJOS669R3ke8EJokwfQ7BB2+IxMpeK/7qCJ4EmRnPBR4xNWNdw
        -----END RSA PRIVATE KEY-----`;
        */

        const privatePem = fs.readFileSync('/Users/robinb47/SafeDoc/server/Download/private.pem', 'utf-8');

        console.log('Public Key: ', recipientKey );
        console.log('Private-Key: ', privatePem);
        console.log('verschlüsselter Buffer: ', encryptedBuffer);
        //console.log('privateKey: ', privatePem);




        //

        const decryptedBuffer = crypto.privateDecrypt(privatePem, encryptedData);
        console.log("decrypted String: ", decryptedBuffer.toString('base64'));


    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

//Hier um app.post für keymanager erweitern

app.listen(port, () => {
    console.log(`Der Server läuft auf Port ${port}`);
});

