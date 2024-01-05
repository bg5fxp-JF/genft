"use client";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { genft_contractAddresses } from "@/app/constants/contracts";
import { genft_abi } from "@/app/constants/abis";
import StakeCard from "./StakeCard";

export default function Stake() {
	const { address, isConnected } = useAccount();
	const { chain } = useNetwork();
	const [nfts, setNfts] = useState([]);

	const chainId = isConnected ? chain.id : 0;
	const genftAddress =
		chainId in genft_contractAddresses
			? genft_contractAddresses[chainId][0]
			: null;

	const { data: totalNfts } = useContractRead({
		address: genftAddress,
		abi: genft_abi,
		functionName: "totalSupply",
		watch: true,
	});

	useEffect(() => {
		let _nfts = [];
		setNfts(_nfts);
		async function getMetadata(uri) {
			const response = await fetch(uri);
			const metadata = await response.json();
			_nfts.push(metadata);
			setNfts(_nfts);
		}

		async function checkOwner(id) {
			if (totalNfts > 0) {
				const data = await readContract({
					address: genftAddress,
					abi: genft_abi,
					functionName: "ownerOf",
					args: [id],
				});
				if (data == address) {
					const uri = `https://firebasestorage.googleapis.com/v0/b/genft-7f0a3.appspot.com/o/metadata%2F${id}.json?alt=media`;
					getMetadata(uri);
				}
			}
		}

		for (let i = 0; i < totalNfts; i++) {
			checkOwner(i);
		}
	}, [address, totalNfts]);

	function extractTokenId(str) {
		const regex = /#(\d+)/;
		const matches = str.match(regex);

		return matches ? parseInt(matches[1], 10) : null;
	}

	if (!isConnected) {
		return (
			<section className="relative  flex flex-col items-center justify-center w-full max-w-[1440px] min-h-screen  gap-8  mx-auto px-6  bg-bg1 sm:px-16 ">
				<h3 className="text-4xl text-txt1 font-semibold text-center md:text-6xl ">
					Co<span className="text-primary1">nn</span>ect Wallet To Stake
				</h3>
			</section>
		);
	}
	if (isConnected && nfts.length == 0) {
		return (
			<section className="relative  flex flex-col items-center justify-center w-full max-w-[1440px] min-h-screen  gap-8  mx-auto px-6  bg-bg1 sm:px-16 ">
				<h3 className="text-4xl text-txt1 font-semibold text-center md:text-6xl ">
					Mi<span className="text-primary1">n</span>t Some{" "}
					<span className="text-primary1">N</span>FTs To Stake
				</h3>
			</section>
		);
	}
	return (
		<section className="relative  flex flex-col items-center  w-full max-w-[1440px] min-h-screen gap-8  mx-auto px-6  bg-bg1 sm:px-16 ">
			<div className="relative flex flex-col w-full max-w-[550px] gap-y-4 mt-32 pb-6  z-40">
				<h3 className="text-4xl text-txt1 font-semibold text-center md:text-6xl ">
					Stake Your <span className="text-primary1">N</span>FTs
				</h3>
			</div>
			{nfts.map(({ name, image, description }) => {
				const tokenId = extractTokenId(name);
				return (
					<StakeCard
						key={tokenId}
						tokenId={tokenId}
						img={image}
						desc={description}
					/>
				);
			})}
		</section>
	);
}