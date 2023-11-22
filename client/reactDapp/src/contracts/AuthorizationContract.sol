// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecryptionContract {
    address owner; // Adresse des Smart Contract-Besitzers
    mapping(address => bool) authorizedWallets; // Mapping von autorisierten Wallets

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedWallets[msg.sender], "Not an authorized wallet");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addAuthorizedWallet(address wallet) external onlyOwner {
        authorizedWallets[wallet] = true;
    }

    function removeAuthorizedWallet(address wallet) external onlyOwner {
        authorizedWallets[wallet] = false;
    }

    function decryptIPFSContent(
        bytes memory encryptedContent
    ) public onlyAuthorized returns (bytes memory) {
        // Hier implementierst du die Entschlüsselung mit dem privaten Schlüssel
        //GIB DEN VERSCHLÜSSELTEN WERT VON DER WALLET ZURÜCK
        // Gib den entschlüsselten Inhalt zurück
    }
}
