"use client";
import Image from "next/image";

import { useState } from "react";
import OpenAI from "openai";
import Loader from "./Loader";
import axiosRetry from "axios-retry";
import axios from "axios";
import FormData from "form-data";
import { parseEther } from "viem";
import { toast } from "react-toastify";
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, deleteObject } from "firebase/storage";
import {
	useAccount,
	useContractRead,
	useContractWrite,
	useNetwork,
} from "wagmi";
import { genft_abi } from "@/app/constants/abis";
import { genft_contractAddresses } from "@/app/constants/contracts";
import { storageBuckets } from "@/app/constants/constants";

export default function ImageMint() {
	const { isConnected } = useAccount();
	const { chain } = useNetwork();

	const chainId = isConnected ? chain.id : 0;
	const genftAddress =
		chainId in genft_contractAddresses
			? genft_contractAddresses[chainId][0]
			: null;

	const { data: totalSupply } = useContractRead({
		address: genftAddress,
		abi: genft_abi,
		functionName: "totalSupply",
		watch: true,
	});

	const { write } = useContractWrite({
		address: genftAddress,
		abi: genft_abi,
		functionName: "publicMint",
		args: [storageBuckets[chainId]],
		value: parseEther("0.01"),
		onError(error) {
			deleteUpload().then(() => {
				setMinting(false);
				toast.error(error.message);
			});
		},
		onSuccess() {
			setMinting(false);
			setImageUrl("/");
			setUserPrompt("");
			toast.success("Successfully Minted");
		},
	});

	async function deleteUpload() {
		const storageRef = ref(storage, `metadata/${totalSupply}.json`);
		await deleteObject(storageRef);
	}

	const openai = new OpenAI({
		apiKey: process.env.NEXT_PUBLIC_OPEN_AI,
		dangerouslyAllowBrowser: true,
	});

	const [imageUrl, setImageUrl] = useState("/");
	const [userPrompt, setUserPrompt] = useState("");
	const [generatingImg, setGeneratingImg] = useState(false);
	const [minting, setMinting] = useState(false);
	function handlePromptChange(e) {
		setUserPrompt(e.target.value);
	}

	const firebaseConfig = {
		storageBucket: `gs://${storageBuckets[chainId]}`,
	};

	// Initialize Firebase
	let app;
	if (getApps().length == 0) {
		app = initializeApp(firebaseConfig);
	} else {
		app = getApps()[0];
	}

	// Initialize Cloud Storage and get a reference to the service
	const storage = getStorage(app);

	async function imageGeneration() {
		if (!isConnected) {
			toast.warn("Connect Wallet First");

			return 0;
		} else {
			if (userPrompt == "") {
				toast.warn("Input a prompt");
				return 0;
			} else {
				setGeneratingImg(true);
				// const response = await openai.images.generate({
				// 	model: "dall-e-3",
				// 	prompt: userPrompt,
				// 	n: 1,
				// 	size: "1024x1024",
				// });

				await setTimeout(() => {
					//C - 1 second later
					setImageUrl(
						"https://img.freepik.com/free-photo/3d-rendering-dog-puzzle_23-2150780914.jpg?uid=R131559868&semt=ais_ai_generated"
					);
					setGeneratingImg(false);
				}, 2000);

				// setImageUrl(response.data[0].url);

				// setGeneratingImg(false);
			}
		}
	}

	async function uploadFileToPinata(sourceUrl) {
		const axiosInstance = axios.create();
		axiosRetry(axiosInstance, { retries: 5 });

		const data = new FormData();

		const response = await fetch(`/api/mint?sourceUrl=${sourceUrl}`, {
			method: "GET",
			responseType: "arraybuffer",
		});

		const res = await response.arrayBuffer();

		const blob = new Blob([res], { type: "image/png" });

		data.append(`file`, blob);

		const metadata = JSON.stringify({
			name: userPrompt,
		});
		data.append("pinataMetadata", metadata);

		const options = JSON.stringify({
			cidVersion: 0,
		});
		data.append("pinataOptions", options);

		try {
			const res = await axios.post(
				`https://api.pinata.cloud/pinning/pinFileToIPFS`,
				data,
				{
					maxBodyLength: "Infinity",
					headers: {
						"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
					},
				}
			);

			return process.env.NEXT_PUBLIC_GATEWAY_URL + "/ipfs/" + res.data.IpfsHash;
		} catch (error) {
			console.log(error);
		}
	}

	async function uploadMetadataToFirebase(imageUri) {
		const storageRef = ref(storage, `metadata/${totalSupply}.json`);
		const jsonContent = JSON.stringify({
			description: userPrompt,
			external_url: "https://ge-nft.vercel.app",
			image: imageUri,
			name: `GeNFT Artists #${totalSupply}`,
		});

		try {
			const snapshot = await uploadString(storageRef, jsonContent, "raw", {
				contentType: "application/json",
			});
			// console.log(snapshot.metadata.fullPath);
		} catch (error) {
			console.log("Error uploading JSON:", error);
		}
	}

	async function mint(sourceUrl) {
		setMinting(true);

		const imageUri = await uploadFileToPinata(sourceUrl);
		await uploadMetadataToFirebase(imageUri).catch();

		write();
	}

	return (
		<>
			<div className="relative bg-bg2   text-gray-900 text-sm rounded-lg w-64 mx-auto p-3 h-64 flex justify-center items-center">
				{imageUrl != "/" ? (
					<Image
						src={imageUrl}
						alt={userPrompt}
						width={100}
						height={100}
						className="w-full h-full object-contain"
					/>
				) : (
					<Image
						src="/images/preview.png"
						alt="preview"
						width={100}
						height={100}
						className="w-9/12 h-9/12 object-contain opacity-40"
					/>
				)}

				{generatingImg && (
					<div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
						<Loader />
					</div>
				)}
			</div>
			<div className="flex items-center gap-x-3 bg-bg2 text-txt1 rounded-full mt-4 p-2 pl-4">
				<input
					type="text"
					value={userPrompt}
					onChange={handlePromptChange}
					placeholder='A bear amongst galaxies saying "GeNFT Is Cool"'
					className="w-full bg-transparent focus-visible:outline-none"
				/>

				<button
					className="text-reg flex  px-4 py-2 rounded-full transition-all active:scale-95  text-white bg-gradient-160 from-primary2 from-20% to-primary1"
					onClick={imageGeneration}
					disabled={generatingImg}
				>
					Generate
				</button>
			</div>
			<div
				className={`flex flex-col gap-y-4 items-center mx-auto  mt-4  ${
					imageUrl == "/" || !isConnected ? "opacity-0" : "opacity-100"
				}`}
			>
				<button
					className={`text-reg flex  px-4 py-2 rounded-full transition-all active:scale-95 text-primary2 border border-primary2 ${
						imageUrl == "/" || !isConnected ? "pointer-events-none" : ""
					}`}
					onClick={() => mint(imageUrl)}
					disabled={minting}
				>
					Mint{minting && "ing..."}
				</button>
				<p className="text-primary2 text-xsm">*0.01 ETH minting fee</p>
			</div>
		</>
	);
}
