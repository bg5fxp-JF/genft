// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

error NotEnoughFunds();
error MaxNFTsMinted();
error WithdrawUnsuccessful();

contract GENFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Pausable, Ownable {
    uint256 private _nextTokenId;
    uint256 public constant MINT_FEE = 0.01 ether;
    uint256 public immutable i_maxSupply;

    constructor(address initalOwner, uint256 _maxSupply) ERC721("GENFT", "GNT") Ownable(initalOwner) {
        i_maxSupply = _maxSupply;
    }

    function withdraw() external onlyOwner {
        (bool success,) = payable(msg.sender).call{value: address(this).balance}("");
        if (!success) revert WithdrawUnsuccessful();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function publicMint(string memory _storagePointer) public payable {
        if (msg.value != MINT_FEE) revert NotEnoughFunds();
        if (totalSupply() >= i_maxSupply) revert MaxNFTsMinted();
        uint256 tokenId = _nextTokenId++;
        string memory _tokenURI = string(
            abi.encodePacked(
                "https://firebasestorage.googleapis.com/v0/b/",
                _storagePointer,
                "/o/metadata%2F",
                Strings.toString(tokenId),
                ".json?alt=media"
            )
        );
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
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

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
