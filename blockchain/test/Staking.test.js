const { assert, expect } = require("chai");
const { ethers, deployments, network } = require("hardhat");

const MINT_FEE = ethers.parseEther("0.01");

describe("Staking", function () {
	let deployer, account1, account2, account3, account4, account5, account6;
	let staking, tokgen, genft;
	beforeEach(async function () {
		[deployer, account1, account2, account3, account4, account5, account6] =
			await ethers.getSigners();

		tokgen = await ethers.getContractAt(
			"Tokgen",
			(
				await deployments.fixture(["all"])
			).Tokgen.address
		);
		genft = await ethers.getContractAt(
			"GENFT",
			(
				await deployments.fixture(["all"])
			).GENFT.address
		);
		staking = await ethers.getContractAt(
			"Staking",
			(
				await deployments.fixture(["all"])
			).Staking.address
		);
	});

	describe("constructor", function () {
		it("should set the correct Tokgen address", async function () {
			assert.equal(await staking.getTokgenAddress(), tokgen.target);
		});
		it("should set the correct Genft address", async function () {
			assert.equal(await staking.getGenftAddress(), genft.target);
		});
	});

	describe("stake", function () {
		beforeEach(async function () {
			await genft.publicMint({ value: MINT_FEE });
			await genft.approve(staking.target, 0);
		});
		it("should revert if an nft wasn't minted", async function () {
			await expect(staking.stake(1)).to.be.revertedWithCustomError(
				genft,
				"ERC721NonexistentToken"
			);
		});
		it("should revert if sender is not the owner of the nft", async function () {
			await expect(
				staking.connect(account1).stake(0)
			).to.be.revertedWithCustomError(staking, "NotOwnerOfNFT");
		});
		it("should emit that the NFT was staked", async function () {
			await expect(staking.stake(0)).to.emit(staking, "NFTStaked");
		});
	});

	describe("unstake", function () {
		beforeEach(async function () {
			await genft.publicMint({ value: MINT_FEE });
			await genft.approve(staking.target, 0);
			await staking.stake(0);
		});
		it("should revert if an nft wasn't minted", async function () {
			await expect(staking.unstake(1)).to.be.revertedWithCustomError(
				staking,
				"NFTWasNotStaked"
			);
		});
		it("should revert if sender is not the owner of the nft", async function () {
			await expect(
				staking.connect(account1).unstake(0)
			).to.be.revertedWithCustomError(staking, "NFTWasNotStaked");
		});
		it("should emit that the NFT was staked", async function () {
			await expect(staking.unstake(0)).to.emit(staking, "NFTUnstaked");
		});
		it("should return reward", async function () {
			await genft.publicMint({ value: MINT_FEE });

			await staking.unstake(0);
			assert.equal(await tokgen.balanceOf(deployer.address), 0);
		});
		it("should return reward after staked for 3mins", async function () {
			await network.provider.send("evm_increaseTime", [179]);
			await network.provider.send("evm_mine");

			await staking.unstake(0);
			assert.equal(
				await tokgen.balanceOf(deployer.address),
				ethers.parseEther("15")
			);
		});
		it("should return reward after staked for 5mins", async function () {
			await network.provider.send("evm_increaseTime", [299]);
			await network.provider.send("evm_mine");

			await staking.unstake(0);
			assert.equal(
				await tokgen.balanceOf(deployer.address),
				ethers.parseEther("50")
			);
		});
		it("should return reward after staked for 15mins", async function () {
			await network.provider.send("evm_increaseTime", [900]);
			await network.provider.send("evm_mine");

			await staking.unstake(0);
			assert.equal(
				await tokgen.balanceOf(deployer.address),
				ethers.parseEther("225.25")
			);
		});
	});
});
