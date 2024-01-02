const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log, fixture } = deployments;

	const { deployer } = await getNamedAccounts();

	let blocksCon = 1;
	if (!developmentChains.includes(network.name)) blocksCon = 6;

	// const tokgenAddress = (await fixture(["tokgen"])).Tokgen.address;
	// const genftAddress = (await fixture(["genft"])).GENFT.address;
	const tokgenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
	const genftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
	const args = [tokgenAddress, genftAddress];

	const staking = await deploy("Staking", {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: blocksCon,
	});

	log("============================================================");

	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		// verify
		await verify(genft.address, args);
	}

	// transfer tokgen to this contract

	log("Sending Tokgen to Staking Contract...");
	const tokgen = await ethers.getContractAt("Tokgen", tokgenAddress);
	await tokgen.transfer(staking.address, ethers.parseEther("10000"));
	log("Sent");
};

module.exports.tags = ["all", "staking"];
