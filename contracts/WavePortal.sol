// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    constructor() {
        console.log("Welcome to my wave-portal");
    }

    struct Wave {
        address sender;
        string message;
        uint time;
    }

    Wave[] waveArray; 

    uint public totalWaves;

    function wave(string memory message) public {
        totalWaves = totalWaves + 1;
        waveArray.push(Wave(msg.sender, message, block.timestamp));
        console.log("%s has waved at %d with a message %s", msg.sender,block.timestamp,message);
    }

    function getAllWaves() public view returns(Wave[] memory){
        return waveArray;
    }

    function getTotalWaves() public view returns(uint) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}