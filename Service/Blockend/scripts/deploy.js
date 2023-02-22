const { ethers } = require("hardhat")
const hre = require("hardhat")
const hardhatConfig = require("../hardhat.config");
const { verify } = require("./verify")



async function main() {

    // manage the deployer
    console.log("Deploying Service contract.....")
    const deployerAddress = hardhatConfig.address.rozzo;
    const Service = await ethers.getContractFactory("Service");
    const service = await Service.deploy(deployerAddress); // need to add address that will be the owner
    await service.deployed();

    // verify
    console.log(`Contract Deployed at: `, service.address);
    console.log(`Deployed by: `, deployerAddress);
    console.log(typeof(deployerAddress));
    await sleep(10000);
    console.log("Verifying...");
    await verify(service.address, deployerAddress);
    console.log("-------------------------------------------------")

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
})
