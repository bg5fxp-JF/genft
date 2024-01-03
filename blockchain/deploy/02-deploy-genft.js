const { network } = require("hardhat");
const { developmentChains, MAX_SUPPLY } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;

	const { deployer } = await getNamedAccounts();

	let blocksCon = 1;
	if (!developmentChains.includes(network.name)) blocksCon = 6;

	const args = [deployer, MAX_SUPPLY];

	const genft = await deploy("GENFT", {
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
};

module.exports.tags = ["all", "genft", "prelim"];
