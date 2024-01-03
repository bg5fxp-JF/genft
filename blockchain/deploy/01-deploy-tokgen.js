const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;

	const { deployer } = await getNamedAccounts();

	log("============================================================");

	let blocksCon = 1;

	if (!developmentChains.includes(network.name)) blocksCon = 6;

	const tokgen = await deploy("Tokgen", {
		from: deployer,
		args: [],
		log: true,
		waitConfirmations: blocksCon,
	});

	log("============================================================");

	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		// verify
		await verify(tokgen.address, []);
	}
};

module.exports.tags = ["all", "tokgen", "prelim"];
