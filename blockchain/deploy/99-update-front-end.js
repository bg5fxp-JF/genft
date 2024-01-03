const { deployments, network } = require("hardhat");
require("dotenv").config();
const fs = require("fs");

const FRONTEND_TOKGEN_ADDRESSES_FILE =
	"../frontend/src/app/constants/tokgen-contractAddresses.json";
const FRONTEND_GENFT_ADDRESSES_FILE =
	"../frontend/src/app/constants/genft-contractAddresses.json";
const FRONTEND_STAKING_ADDRESSES_FILE =
	"../frontend/src/app/constants/staking-contractAddresses.json";
const FRONTEND_TOKGEN_ABI_FILE =
	"../frontend/src/app/constants/tokgen-abi.json";
const FRONTEND_GENFT_ABI_FILE = "../frontend/src/app/constants/genft-abi.json";
const FRONTEND_STAKING_ABI_FILE =
	"../frontend/src/app/constants/staking-abi.json";

async function updateAbi() {
	const tokegnAbi = (await deployments.fixture(["all"])).Tokgen.abi;
	const genftAbi = (await deployments.fixture(["all"])).GENFT.abi;
	const stakingAbi = (await deployments.fixture(["all"])).Staking.abi;

	fs.writeFileSync(FRONTEND_TOKGEN_ABI_FILE, JSON.stringify(tokegnAbi));
	fs.writeFileSync(FRONTEND_GENFT_ABI_FILE, JSON.stringify(genftAbi));
	fs.writeFileSync(FRONTEND_STAKING_ABI_FILE, JSON.stringify(stakingAbi));
}

async function updateContractAddresses() {
	const tokgenAddress = (await deployments.fixture(["all"])).Tokgen.address;
	const genftAddress = (await deployments.fixture(["all"])).GENFT.address;
	const stakingAddress = (await deployments.fixture(["all"])).Staking.address;
	const chainId = network.config.chainId.toString();
	const currentTokgenAddress = JSON.parse(
		fs.readFileSync(FRONTEND_TOKGEN_ADDRESSES_FILE, "utf8")
	);
	const currentGenftAddress = JSON.parse(
		fs.readFileSync(FRONTEND_GENFT_ADDRESSES_FILE, "utf8")
	);
	const currentStakingAddress = JSON.parse(
		fs.readFileSync(FRONTEND_STAKING_ADDRESSES_FILE, "utf8")
	);
	if (chainId in currentTokgenAddress) {
		if (!currentTokgenAddress[chainId].includes(tokgenAddress)) {
			currentTokgenAddress[chainId].push(tokgenAddress);
		}
	} else {
		currentTokgenAddress[chainId] = [tokgenAddress];
	}
	if (chainId in currentGenftAddress) {
		if (!currentGenftAddress[chainId].includes(genftAddress)) {
			currentGenftAddress[chainId].push(genftAddress);
		}
	} else {
		currentGenftAddress[chainId] = [genftAddress];
	}
	if (chainId in currentStakingAddress) {
		if (!currentStakingAddress[chainId].includes(stakingAddress)) {
			currentStakingAddress[chainId].push(stakingAddress);
		}
	} else {
		currentStakingAddress[chainId] = [stakingAddress];
	}

	fs.writeFileSync(
		FRONTEND_TOKGEN_ADDRESSES_FILE,
		JSON.stringify(currentTokgenAddress)
	);
	fs.writeFileSync(
		FRONTEND_GENFT_ADDRESSES_FILE,
		JSON.stringify(currentGenftAddress)
	);
	fs.writeFileSync(
		FRONTEND_STAKING_ADDRESSES_FILE,
		JSON.stringify(currentStakingAddress)
	);
}

module.exports = async function () {
	if (process.env.UPDATE_FRONTEND) {
		console.log("Updating frontend");
		await updateAbi();
		await updateContractAddresses();
	}
};

module.exports.tags = ["frontend"];
