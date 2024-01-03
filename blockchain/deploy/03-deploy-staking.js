const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

async function getAddresses() {
	const tokgenAddress = (await deployments.fixture(["prelim"])).Tokgen.address;
	const genftAddress = (await deployments.fixture(["prelim"])).GENFT.address;

	return [tokgenAddress, genftAddress];
}

async function deployStaking(deployer, args, blocksCon) {
	const staking = await deployments.deploy("Staking", {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: blocksCon,
	});

	return staking;
}

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy } = deployments;

	const { deployer } = await getNamedAccounts();

	let blocksCon = 1;
	if (!developmentChains.includes(network.name)) blocksCon = 6;

	// const tokgenAddress1 = (await fixture(["all"])).Tokgen.address;
	// const genftAddress = (await fixture(["genft"])).GENFT.address;
	// const tokgenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
	// const genftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
	const [tokgenAddress, genftAddress] = await getAddresses();

	const args = [tokgenAddress, genftAddress];
	const staking = await deploy("Staking", {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: blocksCon,
	});
	console.log(`deployed "Staking" at ${staking.address}`);
	console.log("============================================================");

	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		// verify
		await verify(staking.address, args);
	}

	// transfer tokgen to this contract

	console.log("Sending Tokgen to Staking Contract...");
	const tokgen = await ethers.getContractAt("Tokgen", tokgenAddress);
	await tokgen.transfer(staking.address, ethers.parseEther("10000"));
	console.log("Sent");
};

module.exports.tags = ["all", "staking"];
