const { assert, expect } = require("chai");
const hardhatConfig = require("../hardhat.config");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const truffleAssert = require('truffle-assertions');
const { ethers } = require("hardhat");
const axios = require("axios");
const BigNumber = require("bignumber.js");



describe("Service contract unit testing", function() {
    // first function is the deploy fixutre to reuse
    async function deployServiceFixture() {
        const [deployer] = await ethers.getSigners();
        const Service = await ethers.getContractFactory("Service");
        const service = await Service.deploy(deployer.getAddress());
        await service.deployed();
        return service;
    }

    async function deployBigFixture() {
        // deployt load fixture, we add new provider, we createService, return the contract
        const [deployer, provider] = await ethers.getSigners();
        const ServiceContract = await loadFixture(deployServiceFixture); 
        const fee = 1^10;
        await ServiceContract.connect(provider).NewProvider(fee);
        const ServiceStandar = [0,  provider.address,  "My Service",  100];
        await ServiceContract.CreateService(ServiceStandar);
        return (ServiceContract);

    }

    describe("Checking constructor", function() {
        it("Shold set owner address correclty", async () => {
            // deployt fixture to use
            const deployer = await ethers.getSigner();
            const ServiceContract = await loadFixture(deployServiceFixture);
            const owner = await ServiceContract.getOwner();
            assert.equal(owner, deployer.address);
        })
    })

    describe("Set new provider", function() {
        it("Should add new provider to the Whitelist", async () => {
            const [deployer, provider] = await ethers.getSigners();
            const ServiceContract = await loadFixture(deployServiceFixture);
            const fee = 1^10;
            await ServiceContract.connect(provider).NewProvider(fee);
            const NewProviderAdded = await ServiceContract.isWhitelistProvider(provider.address);
            assert.equal(NewProviderAdded, true);
        })
    })

    // await to cathc the return not the promis

    describe("Create a new Service", function() {
        it("Should create a new service form the provider", async () => {
            const [deploy, provider] = await ethers.getSigners();
            const fee = 1^10;
            const ServiceContract = await loadFixture(deployServiceFixture);
            const ServiceStandar = [0,  provider.address,  "My Service",  100];
            await ServiceContract.connect(provider).NewProvider(fee);
            await ServiceContract.CreateService(ServiceStandar);
            const getService = await ServiceContract.GetProviderService(provider.address)
            assert.equal(getService.address, ServiceStandar.address);
        })
    })

    describe("Request an available service", function() {
        it ("Should request a service and mapp the user to service", async () => {
            // it's necesarh to do all the process to have a provadir to request a service
            const [deployer, provider, user] = await ethers.getSigners();
            const ServiceContract = await loadFixture(deployBigFixture);
            const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
            const BalanceBefore = await provider.getBalance();
            const EthPrice = response.data.ethereum.usd;
            console.log(typeof(EthPrice));
            console.log(EthPrice);
            EthToPay = (1700 / EthPrice);
            console.log(EthToPay);
            const EthPriceBigNumber = EthPrice * 10^18;
            await ServiceContract.RequestService(provider.address, EthPriceBigNumber, {value: EthPriceBigNumber});
            const BalanceAfter = await provider.getBalance()
            // check the requestService
            console.log(BalanceBefore);
            console.log(BalanceAfter);
            await assert(BalanceAfter > BalanceBefore);
        })
    })

    describe("Revoke Service", function() {
        it("Should eliminate/revoke the service", async ()=> {
            const [deployer, provider, user] = await ethers.getSigners();
            const ServiceContract = await loadFixture(deployBigFixture);
            const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
            const EthPrice = response.data.ethereum.usd;
            const EthPriceBigNumber = EthPrice * 10^18;
            await ServiceContract.RequestService(provider.address, EthPriceBigNumber, {value: EthPriceBigNumber});
            const BeforeRevoked = await ServiceContract.GetProviderService(provider.address)
            await ServiceContract.RevokeService(provider.address);
           let afterRevoked = await ServiceContract.GetProviderService(provider.address);
           await expect(afterRevoked.provider.address != provider.address);
        })

        describe("ChangeToShipping fucntion", function() {
            it("Should change the state of the service to Shipping", async () => {
                const [deployer, provider, user] = await ethers.getSigners();
                const ServiceContract = await loadFixture(deployServiceFixture);
                const fee = 1^10;
                const ServiceStandar = [0,  provider.address,  "My Service",  100];
                await ServiceContract.connect(provider).NewProvider(fee);
                const ServiceIndex = await ServiceContract.GethasServiceIndex(provider.address);
                await ServiceContract.CreateService(ServiceStandar);
                const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
                const EthPrice = response.data.ethereum.usd;
                const EthPriceBigNumber = EthPrice * 10^18;
                await ServiceContract.RequestService(provider.address, EthPriceBigNumber, {value: EthPriceBigNumber});
                await ServiceContract.ChangeToShipping(provider.address);
                expect((await ServiceContract.serviceAvailable(ServiceIndex)).state).to.equal(2);
            })
        })

        describe("Change to Shipped", function() {
            it("should chage the state to shippped and delete the service", async () => {
                const [deployer, provider, user] = await ethers.getSigners();
                const ServiceContract = await loadFixture(deployServiceFixture);
                const fee = 1^10;
                const ServiceStandar = [0,  provider.address,  "My Service",  100];
                await ServiceContract.connect(provider).NewProvider(fee);
                await ServiceContract.CreateService(ServiceStandar);
                const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
                const EthPrice = response.data.ethereum.usd;
                const EthPriceBigNumber = EthPrice * 10^18;
                await ServiceContract.RequestService(provider.address, EthPriceBigNumber, {value: EthPriceBigNumber});
                await ServiceContract.ChangeToShipping(provider.address);
                await ServiceContract.connect(provider).ChangeToShipped();
            })
        })

    })
})

