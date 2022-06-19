// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    constructor() {
        console.log("Welcome to my wave-portal");
    }

    uint public totalWaves;

    function wave() public {
        totalWaves = totalWaves + 1;
        console.log("%s has waved", msg.sender);
    }

    function getTotalWaves() public view returns(uint) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}