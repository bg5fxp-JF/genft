// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol";

error NotOwnerOfNFT();
error NFTWasNotStaked();

contract Staking is IERC721Receiver, ERC721Holder {
    using SafeERC20 for IERC20;

    IERC20 immutable tokgen;
    IERC721 immutable genft;

    mapping(address => mapping(uint256 => uint256)) stakes;
    mapping(address => mapping(uint256 => bool)) hasStaked;

    // set up interfaces
    constructor(address _tokgen, address _genft) {
        tokgen = IERC20(_tokgen);
        genft = IERC721(_genft);
    }

    event NFTStaked(address indexed owner, uint256 id, uint256 time);
    event NFTUnstaked(address indexed owner, uint256 id, uint256 time, uint256 rewardTokens);

    function stake(uint256 _tokenId) public {
        if (genft.ownerOf(_tokenId) != msg.sender) revert NotOwnerOfNFT();
        stakes[msg.sender][_tokenId] = block.timestamp;
        hasStaked[msg.sender][_tokenId] = true;
        genft.safeTransferFrom(msg.sender, address(this), _tokenId);

        emit NFTStaked(msg.sender, _tokenId, block.timestamp);
    }

    function unstake(uint256 _tokenId) public {
        if (!hasStaked[msg.sender][_tokenId]) revert NFTWasNotStaked();
        uint256 reward = calculateReward(_tokenId);
        delete stakes[msg.sender][_tokenId];
        delete hasStaked[msg.sender][_tokenId];

        tokgen.safeTransfer(msg.sender, reward);
        emit NFTUnstaked(msg.sender, _tokenId, block.timestamp, reward);
    }

    function calculateReward(uint256 _tokenId) private view returns (uint256 reward) {
        uint256 time = block.timestamp - stakes[msg.sender][_tokenId];
        reward = calculateRate(time) * time * 10 ** 18 / 1 minutes;
    }

    function calculateRate(uint256 time) private pure returns (uint8) {
        if (time < 1 minutes) {
            return 0;
        } else if (time < 4 minutes) {
            return 5;
        } else if (time < 8 minutes) {
            return 10;
        } else {
            return 15;
        }
    }

    function getTokgenAddress() public view returns (address) {
        return (address(tokgen));
    }

    function getGenftAddress() public view returns (address) {
        return (address(genft));
    }

    function getIsStaked(uint256 _tokenId) public view returns (bool) {
        return (hasStaked[msg.sender][_tokenId]);
    }
}
