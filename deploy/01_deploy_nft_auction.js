const { ethers, deployments, upgrades } = require('hardhat');
const fs = require('fs');
const path = require('path');

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { save } = deployments;
    const { deployer } = await getNamedAccounts();
    console.log("部署用户地址：", deployer);
    const NftAuction = await ethers.getContractFactory("NftAuction");
    const nfgAuctionProxy = await upgrades.deployProxy(NftAuction, [
        // 0x0000000000000000000000000000000000000000,
        // 100 * 1000,
        // ethers.parseEther("0.000000000000000001"),
        // ethers.ZeroAddress,
        // 1
    ],{
        initializer: "initialize"
    });
    await nfgAuctionProxy.waitForDeployment();
    const proxyAddress = await nfgAuctionProxy.getAddress();
    console.log("代理合约地址：", proxyAddress)
    const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("实现合约地址：", implAddress)
    
    const storePath = path.resolve(__dirname, "./.cache/proxyNftAuction.json");
    fs.writeFileSync(
        storePath,
        JSON.stringify({
            proxyAddress,
            implAddress,
            abi: NftAuction.interface.format('json')
            // implAddress:
        })
    )
    await save("NftAuctionProxy", {
        abi: NftAuction.interface.format('json'),
        address: proxyAddress,
        args: [],
        log: true
    })
    
    // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    
//   const { deploy } = deployments;
//   const { deployer } = await getNamedAccounts();
//   await deploy("MyContract", {
//     from: deployer,
//     args: ["Hello"],
//     log: true,
//   });
};
// add tags and dependencies
module.exports.tags = ["deployNftAuction"];