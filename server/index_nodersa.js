const NodeRSA = require('node-rsa');
const fs = require('fs');
const path = require('path');

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
}

// Funktion zum Laden und Entschlüsseln von Daten
function decryptData(encryptedData) {
  // Laden Sie den privaten Schlüssel aus dem Download-Ordner
  const privateKeyPath = path.join(__dirname, 'Download', 'private.pem');
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

  const key = new NodeRSA(privateKey, 'pkcs1-private');

  try {
    const decryptedData = key.decrypt(encryptedData, 'utf8');
    console.log('Entschlüsselte Daten:', decryptedData);
  } catch (error) {
    console.error('Fehler bei der Entschlüsselung:', error);
  }
}

// Funktion zum Verschlüsseln von Daten
function encryptData(data) {
  // Laden Sie den öffentlichen Schlüssel aus dem Download-Ordner
  const publicKeyPath = path.join(__dirname, 'Download', 'public.pem');
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

  const key = new NodeRSA(publicKey, 'pkcs8-public');

  // Verschlüsseln Sie die gegebene Zeichenfolge
  const encryptedData = key.encrypt(data, 'base64');
  console.log('Verschlüsselte Daten:', encryptedData);

  // Rufen Sie die Funktion zum Entschlüsseln der Daten auf
  decryptData(encryptedData);
}

// Generieren Sie das Schlüsselpaar und rufen Sie die Funktion zum Verschlüsseln von Daten auf
generateKeyPair();
encryptData('Hello, World!');
