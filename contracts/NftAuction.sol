// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

contract NftAuction is Initializable, UUPSUpgradeable{
    struct Auction{
        address seller;
        uint256 duration;
        uint256 startPrice;
        uint256 startTime;

        bool ended;
        address highestBidder;
        uint256 highestBid;


        address nftContract;
        uint256 tokenId;
    }

    mapping(uint256 => Auction) public auctions;
    uint256 public nextAuctionId;

    address public admin;

    


    function initialize () initializer public {
        admin = msg.sender;
    }

    function createAuction(uint256 _duration, uint256 _startPrice, address _nftAddress, uint256 _tokenId) public {
         // 只有管理员可以创建拍卖
        require(msg.sender == admin, "Only admin can create auctions");
        // 检查参数
        require(_duration >= 10, "Duration must be greater than 10s");
        require(_startPrice > 0, "Start price must be greater than 0");

        IERC721(_nftAddress).approve(address(this), _tokenId);

        auctions[nextAuctionId] = Auction({
            seller: msg.sender,
            duration: _duration,
            startPrice: _startPrice,
            startTime: block.timestamp,
            ended: false,
            highestBidder: address(0),
            highestBid: 0,
            nftContract: _nftAddress,
            tokenId: _tokenId
        });
        nextAuctionId++;
    }
    // 买家参与买单
    function placeBid(uint256 _auctionId) external payable{
        Auction storage auction = auctions[_auctionId];
        require(!auction.ended && (auction.startTime + auction.duration) > block.timestamp, "auction is ended");
        require(msg.value > auction.highestBid && msg.value >= auction.startPrice, "Bid must higher than current highest Bid");
        if (auction.highestBidder != address(0)){
            payable(auction.highestBidder).transfer(auction.highestBid);
        }
        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;
    }

    function endAuction(uint256 _auctionId) external {
        Auction storage auction =  auctions[_auctionId];
        require(!auction.ended && (auction.startTime + auction.duration) <= block.timestamp, "Auction has not ended");
        console.log("auction.nftContract:", auction.nftContract);
        console.log("address(this):", address(this));
        console.log("auction.highestBidder:", auction.highestBidder);
        IERC721(auction.nftContract).safeTransferFrom(address(this), auction.highestBidder, auction.tokenId);
        payable(address(this)).transfer(address(this).balance);
        auction.ended = true;
    }
    function _authorizeUpgrade(address newImplementation) internal override view{
        require(msg.sender == admin, "only admin can upgrade");

    }
}