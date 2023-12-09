// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RSAPublicKeyRegistry {
    mapping(address => string) public rsaPublicKeys;

    function setRSAPublicKey(string memory publicKey) public {
        require(bytes(publicKey).length > 0, "RSA public key cannot be empty");
        rsaPublicKeys[msg.sender] = publicKey;
    }

    function getRSAPublicKey() public view returns (string memory) {
        return rsaPublicKeys[msg.sender];
    }
}
