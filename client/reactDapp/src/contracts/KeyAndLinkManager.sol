// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * The KeyAndLinkManager contract manages keys and documents for two specific users (writers).
 * It allows each writer to set and retrieve their own key, set documents for the other user,
 * and retrieve documents meant for them. It also includes basic access control to ensure that
 * only the intended users can set or retrieve their keys and documents.
 */
contract KeyAndLinkManager {
    // Default keys for user A and B, initialized to indicate no key has been saved yet.
    string public keyA = "no saved key from user A";
    string public keyB = "no saved key from user B";

    // Default documents for user A and B, indicating no document has been saved yet.
    string public documentForA = "no saved document for you";
    string public documentForB = "no saved document for you";

    // Ethereum addresses for user A and B, acting as identifiers for the writers.
    address public writerA = 0xA7CdB7Ab931bd7BBb115dC8691e8e488FcA6E9ca;
    address public writerB = 0xb26869e0C28E38f41173167b3c165E2768570B3B;

    // A warning message, initially set to indicate no warnings.
    string warning = "no warnings";

    /**
     * Allows a writer to update their key. The key value is updated based on the sender's address.
     * If an unauthorized address attempts to set a key, a warning message is set.
     */
    function setKey(string memory keyValue) external {
        if (msg.sender == writerA) {
            keyA = keyValue;
        } else if (msg.sender == writerB) {
            keyB = keyValue;
        } else {
            warning = "be careful";
        }
    }

    /**
     * Returns the opposite writer's key to the caller. This ensures each writer can only access
     * the other's public key, not their own. If an unauthorized user calls this function, it returns
     * a message indicating lack of access.
     */
    function getKey() public view returns (string memory) {
        if (msg.sender == writerA) {
            return keyB;
        } else if (msg.sender == writerB) {
            return keyA;
        } else {
            return "You are not allowed to receive a key";
        }
    }

    /**
     * Returns the caller's own key. This function ensures a writer can access their own key.
     * Unauthorized users receive a message indicating they are not allowed.
     */
    function getOwnKey() public view returns (string memory) {
        if (msg.sender == writerA) {
            return keyA;
        } else if (msg.sender == writerB) {
            return keyB;
        } else {
            return "not allowed";
        }
    }

    /**
     * Allows a writer to set a document for the other user. Access control ensures that only
     * a designated writer can call this function. Attempt by any other address throws an error.
     */
    function setDocument(string memory doc) external {
        if (msg.sender == writerA) {
            documentForB = doc;
        } else if (msg.sender == writerB) {
            documentForA = doc;
        } else {
            require(
                msg.sender == writerA || msg.sender == writerB,
                "You are not authorized"
            );
        }
    }

    /**
     * Allows a writer to retrieve the document meant for them. If an unauthorized user attempts
     * to call this function, it returns a message indicating they are not allowed to receive a document.
     */
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
