// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

error NotOwnerOfNFT();
error NFTWasNotStaked();

contract Staking {
    using SafeERC20 for IERC20;

    IERC20 immutable tokgen;
    IERC721 immutable genft;

    mapping(address => mapping(uint256 => uint256)) stakes;

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
        genft.safeTransferFrom(msg.sender, address(this), _tokenId);

        emit NFTStaked(msg.sender, _tokenId, block.timestamp);
    }

    function unstake(uint256 _tokenId) public {
        if (stakes[msg.sender][_tokenId] == 0) revert NFTWasNotStaked();
        uint256 reward = calculateReward(_tokenId);
        delete stakes[msg.sender][_tokenId];

        tokgen.safeTransfer(msg.sender, reward);
    }

    function calculateReward(uint256 _tokenId) private view returns (uint256 reward) {
        uint256 time = block.timestamp - stakes[msg.sender][_tokenId];
        reward = calculateRate(time) * time * 10 ** 18 / 1 minutes;
    }

    function calculateRate(uint256 time) private view returns (uint8) {
        if (block.timestamp - time < 1 minutes) {
            return 0;
        } else if (block.timestamp - time < 4 minutes) {
            return 5;
        } else if (block.timestamp - time < 8 minutes) {
            return 10;
        } else {
            return 15;
        }
    }
}
