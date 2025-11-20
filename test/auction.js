const { ethers, deployments, upgrades } = require('hardhat');
const { expect } = require('chai')

describe("test auction", function() {
  it("should be ok",async function () {
    await main();
  })
});

async function  main() {
    const [singer, buyer] = await ethers.getSigners()
    await deployments.fixture(["deployNftAuction"]);
    const nftAuctionProxy = await deployments.get("NftAuctionProxy");
    const nftAuction = await ethers.getContractAt("NftAuction", nftAuctionProxy.address);

    const TestERC721 = await ethers.getContractFactory("TestERC721");
    const testERC721 =  await TestERC721.deploy();
    await testERC721.waitForDeployment();
    const testERC721Address = await testERC721.getAddress();
    console.log("testERC721 address:", testERC721Address);

    console.log("singer.address::", singer.address);
    console.log("buyer.address::", buyer.address);
    for(let i=0; i < 10; i++) {
      
        await testERC721.mint(singer.address, i+1);
    }

    const tokenId = 1;
    

    await testERC721.connect(singer).setApprovalForAll(nftAuctionProxy.address, true);


    await nftAuction.createAuction(
      10,
      ethers.parseEther("0.01"),
      testERC721Address,
      tokenId
    )

    const auction = await nftAuction.auctions(0);
    console.log("auction", auction);

    nftAuction.connect(buyer).placeBid(0, {value: ethers.parseEther("0.01")})


    await new Promise((resolve) => { setTimeout(resolve, 10 * 1000)});
    // 调用合约中的endAuction时执行safeTransferFrom时ERC721IncorrectOwner
    await nftAuction.connect(singer).endAuction(0);


    const auctionResult = await nftAuction.auctions(0);
    console.log("结束拍卖后读取拍卖成功：", auctionResult);

    expect(auctionResult.highestBidder).to.equal(buyer.address);
    expect(auctionResult.highestBid).to.equal(ethers.parseEther("0.01"));


    const owner = await testERC721.ownerOf(tokenId);
    console.log('owner:', owner)
    expect(owner).to.equal(buyer.address);


}