// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error NotEnoughFunds();
error MaxNFTsMinted();

contract GENFT is ERC721, ERC721Enumerable, ERC721Pausable, Ownable {
    uint256 private _nextTokenId;
    uint256 public constant MINT_FEE = 0.01 ether;
    uint256 public immutable i_maxSupply;
    address public immutable i_owner;

    constructor(uint256 _maxSupply) ERC721("GENFT", "GNT") Ownable(i_owner) {
        i_maxSupply = _maxSupply;
        i_owner = msg.sender;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://firebasestorage.googleapis.com/v0/b/genft-7f0a3.appspot.com/o/metadata%2F";
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function publicMint() public payable {
        if (msg.value != MINT_FEE) revert NotEnoughFunds();
        if (totalSupply() >= i_maxSupply) revert MaxNFTsMinted();
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
