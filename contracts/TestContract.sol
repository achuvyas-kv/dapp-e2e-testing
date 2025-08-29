// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TestContract {
    string public message;
    
    event MessageSet(string newMessage, address sender);
    
    constructor() {
        message = "Hello from Hardhat!";
    }
    
    function setMessage(string memory newMessage) public {
        message = newMessage;
        emit MessageSet(newMessage, msg.sender);
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
} 