// contracts/DocumentRegistry.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentRegistry {
    struct Document {
        address signer;
        bytes32 hash;
        uint256 timestamp;
    }

    mapping(bytes32 => Document) public documents;

    event DocumentRegistered(bytes32 indexed hash, address indexed signer, uint256 timestamp);

    function registerDocument(bytes32 hash) public {
        require(documents[hash].timestamp == 0, "Document already registered");

        documents[hash] = Document({
            signer: msg.sender,
            hash: hash,
            timestamp: block.timestamp
        });

        emit DocumentRegistered(hash, msg.sender, block.timestamp);
    }

    function isRegistered(bytes32 hash) public view returns (bool) {
        return documents[hash].timestamp != 0;
    }

    function getDocument(bytes32 hash) public view returns (address, uint256) {
        require(isRegistered(hash), "Document not found");
        Document memory doc = documents[hash];
        return (doc.signer, doc.timestamp);
    }
}
