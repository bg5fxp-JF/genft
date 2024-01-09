const { deployments, network, getNamedAccounts } = require("hardhat");

require("dotenv").config();
const fs = require("fs");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

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

async function update() {
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	const Deployments = await deployments.fixture(["prelim"]);
	const tokgenAddress = Deployments.Tokgen.address;
	const genftAddress = Deployments.GENFT.address;
	const tokgenAbi = Deployments.Tokgen.abi;
	const genftAbi = Deployments.GENFT.abi;

	console.log("Deploying Staking Contract");
	let blocksCon = 1;
	if (!developmentChains.includes(network.name)) blocksCon = 6;
	const args = [tokgenAddress, genftAddress];
	const staking = await deploy("Staking", {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: blocksCon,
	});
	const stakingAddress = staking.address;
	const stakingAbi = staking.abi;
	console.log(`Deployed at staking at ${stakingAddress}`);
	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		// verify
		await verify(stakingAddress, [tokgenAddress, genftAddress]);
	}

	console.log("Sending Tokgen to Staking Contract...");
	const tokgen = await ethers.getContractAt("Tokgen", tokgenAddress);
	await tokgen.transfer(stakingAddress, ethers.parseEther("10000"));
	console.log("Sent");

	console.log("===========================");
	console.log("Updating ABI");
	updateAbi(tokgenAbi, genftAbi, stakingAbi);
	console.log("===========================");
	console.log("Updating Adresses");
	updateContractAddresses(tokgenAddress, genftAddress, stakingAddress);
}

function updateAbi(tokgenAbi, genftAbi, stakingAbi) {
	fs.writeFileSync(FRONTEND_TOKGEN_ABI_FILE, JSON.stringify(tokgenAbi));
	fs.writeFileSync(FRONTEND_GENFT_ABI_FILE, JSON.stringify(genftAbi));
	fs.writeFileSync(FRONTEND_STAKING_ABI_FILE, JSON.stringify(stakingAbi));
}

function updateContractAddresses(tokgenAddress, genftAddress, stakingAddress) {
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
		await update();
	}
};

module.exports.tags = ["frontend"];
