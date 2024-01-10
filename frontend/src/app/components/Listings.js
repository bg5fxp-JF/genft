"use client";
import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { genft_contractAddresses } from "../constants/contracts";
import { genft_abi } from "../constants/abis";
import { readContract } from "@wagmi/core";
import { CORSANYWHERE, storageBuckets } from "../constants/constants";

export default function Listings() {
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
		async function getMetadata(uri, owner) {
			const response = await fetch(CORSANYWHERE + uri);
			const metadata = await response.json();
			metadata.uri = uri;
			metadata.owner = owner;
			_nfts.push(metadata);
			setNfts(_nfts);
		}

		async function checkOwner(id) {
			if (totalNfts > 0) {
				let owner = await readContract({
					address: genftAddress,
					abi: genft_abi,
					functionName: "ownerOf",
					args: [id],
				});

				if (owner == address) {
					owner = "You";
				}

				const uri = `https://firebasestorage.googleapis.com/v0/b/${storageBuckets[chainId]}/o/metadata%2F${id}.json?alt=media`;

				getMetadata(uri, owner);
			}
		}

		for (let i = 0; i < totalNfts; i++) {
			checkOwner(i);
		}
	}, [isConnected, address, totalNfts]);

	useEffect(() => {
		setNfts([...nfts]);
	}, [nfts.length]);

	function extractTokenId(str) {
		const regex = /#(\d+)/;
		const matches = str.match(regex);

		return matches ? parseInt(matches[1], 10) : null;
	}

	return (
		<section className="relative  flex flex-col gap-y-5 items-center w-full max-w-[1440px] min-h-screen gap-8  mx-auto px-6  sm:px-16  bg-bg1 ">
			<h3 className=" mt-24 text-3xl text-txt1 font-semibold text-center md:text-6xl ">
				Mi<span className="text-primary1">n</span>ted
				<span className="text-primary1"> N</span>FTs
			</h3>
			<div className="w-full ">
				<div className="flex w-full gap-x-2 px-3 text-txt2 ">
					<p className="w-10% sm:w-[5%]">#</p>
					<p className="w-[60%] sm:w-[50%]">Name</p>
					<p className="w-[30%]">Owner</p>
					<p className="w-[10%]">URI</p>
				</div>
				<hr className="w-full" />
			</div>
			{isConnected ? (
				nfts.map(({ name, image, description, uri, owner }) => {
					const tokenId = extractTokenId(name);
					return (
						<ListingCard
							key={tokenId}
							uri={uri}
							tokenId={tokenId}
							img={image}
							desc={description}
							owner={owner}
						/>
					);
				})
			) : (
				<div className="flex items-center justify-center max-w-[1440px] w-full min-h-[300px]">
					<h3 className="text-3xl text-txt1 font-semibold text-center md:text-4xl ">
						Co<span className="text-primary1">nn</span>ect Wallet To View
					</h3>
				</div>
			)}
		</section>
	);
}
