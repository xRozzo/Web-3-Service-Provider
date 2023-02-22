const { ethers } = require("hardhat")

// aditional configuration for the network

/*

    the helper is useful in case like using VRF Coordinators, when you need information for the constructor linked to the 
    networks chossed.
*/

const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337:{
        name: "localhost",
    },
    5: {
        name: "goerli",
    }
}