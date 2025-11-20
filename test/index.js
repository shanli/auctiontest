// const { ethers, deployments, upgrades } = require('hardhat');
// const { expect } = require('chai')
// describe("test upgrades", function() {
//   it("test upgrades", async function() {
//     await deployments.fixture("deployNftAuction")
//     const nftAuctionProxy = await deployments.get("NftAuctionProxy");

//     const nftAuction = await ethers.getContractAt("NftAuction", nftAuctionProxy.address);

//     await nftAuction.createAuction(
//       100 * 1000,
//       ethers.parseEther("0.01"),
//       ethers.ZeroAddress,
//       1
//     )
//     const auction = await nftAuction.auctions(0);
//     console.log("auction", auction)
//     // const nftAuctionProxy = await deployments.get("NftAuctionProxy");

//     const implAddress1 = await upgrades.erc1967.getImplementationAddress(nftAuctionProxy.address);
//     console.log("implAddress1:", implAddress1);
//     await deployments.fixture("upgradeNftAuction");
//     const implAddress2 = await upgrades.erc1967.getImplementationAddress(nftAuctionProxy.address);


//     const nftAuctionV2 = await ethers.getContractAt("NftAuctionV2", nftAuctionProxy.address);
//     const testH = await nftAuctionV2.testHello();
//     console.log("upgrades returns：：：：", testH)

//     console.log("implAddress2:", implAddress2);
//     const auction2 = await nftAuction.auctions(0);
//     console.log("auction2", auction2)
//     expect(auction2.startTime).to.equal(auction.startTime);
//     expect(implAddress1).not.equal(implAddress2)

//   });
// })
// // describe("starting", function () {

// //   it("Should be able to deploy", async function() {
// //     const Contract = await ethers.getContractFactory("NftAuction");
// //     const contract = await Contract.deploy();

// //     await contract.waitForDeployment();
// //     contract.createAuction(
// //       100 * 1000,
// //       ethers.parseEther("0.000000000000000001"),
// //       ethers.ZeroAddress,
// //       1
// //     )
// //     const auction = await contract.auctions(0);
// //     console.log("auction:", auction);

    
// //   })
// // });
