const CryptoJS = require('crypto-js');

const EthCrypto = require('ethereum-cryptography/ethcrypto');

//const originalCID = 'YourCID';

//Verschlüsselung des CID mit öffentlichen Schlüssel des Empfängers


//neuer Versuch
//Ziel: Verschlüsselung des CID Wertes aus index.js mit Empfänger public Key
//Entschlüsselung durch private Key bzw. Login über MetaMask

const EthCrypto = require('ethereum-cryptography/ethcrypto');
const Web3 = require('web3');

const web3 = new Web3('127.0.0.1:8545');


const senderKeys = EthCrypto.createIdentity();
const receiverAddress = '0xRecipientAddress';
const originalCID = 'YourCID';

//Verschlüsselung durch öffentlichen Schlüssel des Empfängers
const encryptedCID = EthCrypto.encryptWithPublicKey(EthCrypto.publicKeyByAddress(receiverAddress), originalCID);

//Smart Contract-Interaktion zu Speichern des verschlüsselten CIDs
const contractAddress = '0xYourSmartContractAddress';
const contractABI = [""]; //ABI eines Smart Contracts hier einfügen
const myContract = new web3.eth.Contract(contractABI, contractAddress);

myContract.methods.storeEncryptedCID(receiverAddress, encryptedCID).send({
    form: senderKeys.address,
    gas: 300000,
})
