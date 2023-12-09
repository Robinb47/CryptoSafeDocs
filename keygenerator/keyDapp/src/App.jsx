import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import forge from 'node-forge';

function App() {

  const [publicKeyOutput, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [data, setData] = useState("");
  const [decrypt, setDecrypted] = useState(""); 

  
  // Generiere Schlüsselpaar
  const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });  
  const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
  const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);

  // Beispiel für Verschlüsselung
  const dataToEncrypt = 'Hallo, Welt!';
  const encryptedData = forge.pki.publicKeyFromPem(publicKeyPem).encrypt(dataToEncrypt, 'RSA-OAEP');

  // Beispiel für Entschlüsselung
  const decryptedData = keyPair.privateKey.decrypt(encryptedData, 'RSA-OAEP');

  //hier vllt Schlüssel über Smart Contract senden
  //MetaMask einbinden wie in WalletAuth
  //

  const generateKeys = () => {
    setPublicKey(publicKeyPem);
    setPrivateKey(privateKeyPem);
    setData(encryptedData);
    setDecrypted(decryptedData);
  }

  //eine txt.Datei erstellen
  return(
    <div>
      <button onClick={generateKeys}>generate keys</button>
      <h3>Public Key: {publicKeyPem}</h3>
      <h3>Private Key: {privateKeyPem} </h3> 
      <h3>Encrypted Data: {data}</h3> 
      <h3>Decrypted Data: {decrypt}</h3>     
    </div>
  )
}

export default App;
