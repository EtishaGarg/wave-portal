// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {

    uint public totalWaves;

    uint private seed;

    event newWave(address indexed from, uint timestamp, string message);

    struct Wave {
        address sender;
        string message;
        uint time;
    }

    Wave[] waveArray;

    mapping (address => uint) public lastWavedAt;
    constructor () payable{
        console.log("Welcome to my wave-portal");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory message) public {

        require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp, "Wait for 15 mins");

        lastWavedAt[msg.sender] = block.timestamp;
        totalWaves = totalWaves + 1;
        waveArray.push(Wave(msg.sender, message, block.timestamp));
        console.log("%s has waved at %d with a message %s", msg.sender,block.timestamp,message);

        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        if(seed < 50) {
            console.log("%s won!", msg.sender);
            uint prizeAmount = 0.0001 ether;
            require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has");
            (bool success, ) = (msg.sender).call{value : prizeAmount}("");
            require(success, "Failed to send Ether");

        }

        emit newWave(msg.sender,block.timestamp,message); 
    }

    function getAllWaves() public view returns(Wave[] memory){
        return waveArray;
    }

    function getTotalWaves() public view returns(uint) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}