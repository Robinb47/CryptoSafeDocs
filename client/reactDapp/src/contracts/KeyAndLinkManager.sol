// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KeyAndLinkManager {
    string public keyA = "no saved key from user A";
    string public keyB = "no saved key from user B";

    string public documentForA = "no saved document for you";
    string public documentForB = "no saved document for you";

    address public writerA = 0xA7CdB7Ab931bd7BBb115dC8691e8e488FcA6E9ca;
    address public writerB = 0xb26869e0C28E38f41173167b3c165E2768570B3B;

    string warning = "no warnings";

    function setKey(string memory keyValue) external {
        if (msg.sender == writerA) {
            keyA = keyValue;
        } else if (msg.sender == writerB) {
            keyB = keyValue;
        } else {
            warning = "be careful";
        }
    }

    function getKey() public view returns (string memory) {
        if (msg.sender == writerA) {
            return keyB;
        } else if (msg.sender == writerB) {
            return keyA;
        } else {
            return "You are not allowed to receive a key";
        }
    }

    function getOwnKey() public view returns (string memory) {
        if (msg.sender == writerA) {
            return keyA;
        } else if (msg.sender == writerB) {
            return keyB;
        } else {
            return "not allowed";
        }
    }

    function setDocument(string memory doc) external {
        if (msg.sender == writerA) {
            documentForB = doc;
        } else if (msg.sender == writerB) {
            documentForA = doc;
        } else {
            require(
                msg.sender == writerA || msg.sender == writerB,
                "You are not "
            );
        }
    }

    function getDocument() public view returns (string memory) {
        if (msg.sender == writerA) {
            return documentForA;
        } else if (msg.sender == writerB) {
            return documentForB;
        } else {
            return "You are not allowed to receive a Document";
        }
    }
}
