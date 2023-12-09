const crypto = require('crypto');
const NodeRSA = require('node-rsa');

//Generate an RSA key pair
const key = new NodeRSA({b: 512});

//Get the public and private key
const publicKey = key.exportKey('public');
const privateKey = key.exportKey('private');
console.log(publicKey);
console.log(privateKey);

//encrypt a message using the public key
const message = 'https://ipfs.moralis.io:2053/ipfs/QmdHat8QaD1r7Fh1s9U1Y8g7MeT9DRzuB4r5xJYtz2Euy5/uploads/e276722358b61a760975b893a6f66';
const encryptedMessage = key.encrypt(message, 'base64');
console.log('encrypted: ', encryptedMessage);

//decrypt a message using the private key
const decrypted = key.decrypt(encryptedMessage, 'utf-8');
console.log('decrypted: ', decrypted);



/*
const text = "Hello RSA";
const encrypted = key.encrypt(text, 'base64');
console.log('encrypted: ', encrypted);
const decrypted = key.decrypt(encrypted, 'utf-8');
console.log('decrypted: ', decrypted);
*/