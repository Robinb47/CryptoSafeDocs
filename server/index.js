const Moralis = require("moralis").default;
const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const port = 5040;

// Spezifizieren Sie den Speicherort für die hochgeladenen Dateien
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '/Users/robinb47/SafeDoc/server/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage });
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
  app.post('/upload', upload.single('pdfFile'), (req, res) => {
    // Die PDF-Datei wurde erfolgreich hochgeladen und gespeichert
    res.status(200).send('PDF uploaded successfully!');
  });
  
  