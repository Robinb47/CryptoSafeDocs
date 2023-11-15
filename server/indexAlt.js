const Moralis = require("moralis").default;
const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const port = 5040;

const storage = multer.memoryStorage(); // Ändere den Speicherort in den Arbeitsspeicher

const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function uploadToIpfs(fileBuffer) {
  await Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU2N2JiMWRmLWNkZjktNDU1OS1hZDFjLTRjYTIxNDkzZjQ0YiIsIm9yZ0lkIjoiMzU5MTQwIiwidXNlcklkIjoiMzY5MDk3IiwidHlwZUlkIjoiYjZhOGNiMjYtMDNiOC00ZGJkLTljZDMtNjk0YTE3MDIyZGU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTU5NzIwMTgsImV4cCI6NDg1MTczMjAxOH0.r1_76F07nsbUFxAoEBHv446YL3z2rw5h3c-ASG3gKto"
  });

  const uploadArray = [
    {
      path: "TestPDF.pdf", // Name, den du der Datei auf IPFS geben möchtest
      content: fileBuffer.encoding('base64')
    }
  ];

  const response = await Moralis.EvmApi.ipfs.uploadFolder({
    abi: uploadArray
  });

  //const ipfsHash = response.result;
  //const ipfsLink = `https://ipfs.io/ipfs/${ipfsHash}`; // Erzeuge den IPFS-Link

  //console.log(`IPFS-Link: ${ipfsLink}`); // Gib den IPFS-Link in der Konsole aus
  console.log(response.result);


  return ipfsHash;
}

app.post('/upload', upload.single('pdfFile'), async (req, res) => {
  const { buffer } = req.file;

  try {
    const ipfsHash = await uploadToIpfs(buffer);
    res.status(200).json({ ipfsHash }); // Sende den IPFS-Hash an das Frontend
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Hochladen auf IPFS' });
  }
});
