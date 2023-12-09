// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessControl {
    struct Permission {
        uint id;
        string name;
        bytes32 hashValue;
    }

    mapping(address => Permission[]) private accessControlList;

    function grantAccess(
        address walletAddress,
        uint id,
        string memory name,
        bytes32 hashValue
    ) public {
        Permission memory newPermission = Permission(id, name, hashValue);
        accessControlList[walletAddress].push(newPermission);
    }

    function revokeAccess(address walletAddress, uint permissionIndex) public {
        require(
            permissionIndex < accessControlList[walletAddress].length,
            "Invalid permission index"
        );
        delete accessControlList[walletAddress][permissionIndex];
    }

    function getPermissions(
        address walletAddress
    ) public view returns (Permission[] memory) {
        return accessControlList[walletAddress];
    }
}
