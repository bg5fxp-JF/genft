"use client";
import Image from "next/image";

import { useState } from "react";
import OpenAI from "openai";
import Loader from "./Loader";
import CustomLinkButton from "@/app/components/CustomLinkButton";
import axiosRetry from "axios-retry";
import axios from "axios";
import FormData from "form-data";

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString } from "firebase/storage";

export default function ImageMint() {
	const isConnected = true;
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
		// console.log(userPrompt);
		// formatFormData(formData);
	}

	// TODO: Replace the following with your app's Firebase project configuration
	// See: https://firebase.google.com/docs/web/learn-more#config-object
	const firebaseConfig = {
		storageBucket: "gs://genft-7f0a3.appspot.com",
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	// Initialize Cloud Storage and get a reference to the service
	const storage = getStorage(app);

	async function imageGeneration() {
		if (!isConnected) {
			window.alert("Connect Wallet First");

			return 0;
		}
		if (userPrompt == "") {
			window.alert("Input a prompt");
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

			// image_url = response;
			// setImageUrl(response.data[0].url);

			// setGeneratingImg(false);
		}
	}

	async function uploadFileToPinata(sourceUrl) {
		const axiosInstance = axios.create();
		axiosRetry(axiosInstance, { retries: 5 });

		const data = new FormData();

		const response = await axiosInstance(sourceUrl, {
			method: "GET",
			responseType: "arraybuffer",
		});
		const blob = new Blob([response.data], { type: "image/png" });

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
				"https://api.pinata.cloud/pinning/pinFileToIPFS",
				data,
				{
					maxBodyLength: "Infinity",
					headers: {
						"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
					},
				}
			);
			console.log(res.data);
			return process.env.NEXT_PUBLIC_GATEWAY_URL + "/ipfs/" + res.data.IpfsHash;
		} catch (error) {
			console.log(error);
		}
	}
	async function uploadMetadataToPinata(imageUri) {
		const creationDate = new Date().toISOString().split("T")[0];

		const data = JSON.stringify({
			pinataContent: {
				collection: "GeNFT Artists",
				name: userPrompt,
				artist: "0xcc6cfe1a015ecce15176bfabaa2473728da0898f",
				creationDate: creationDate,
				image: imageUri,
			},
			pinataMetadata: {
				name: "metadata.json",
			},
		});

		try {
			const res = await axios.post(
				"https://api.pinata.cloud/pinning/pinJSONToIPFS",
				data,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
					},
				}
			);
			console.log(res.data);
		} catch (error) {
			console.log(error);
		}
	}
	async function uploadMetadataToFirebase(imageUri) {
		const storageRef = ref(storage, "metadata/1.json");
		const jsonContent = JSON.stringify({
			description: userPrompt,
			external_url: "https://genft.com",
			image: imageUri,
			name: "GeNFT Artists #1",
		});

		try {
			const snapshot = await uploadString(storageRef, jsonContent, "raw", {
				contentType: "application/json",
			});

			console.log(snapshot.metadata.fullPath);
		} catch (error) {
			console.log("Error uploading JSON:", error);
		}
	}

	async function mint(sourceUrl) {
		setMinting(true);

		const imageUri = await uploadFileToPinata(sourceUrl);

		await uploadMetadataToFirebase(imageUri).catch();
		setMinting(false);
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
			<div className="flex flex-col gap-y-4 mx-auto mt-4 ">
				<button
					className={`text-reg flex  px-4 py-2 rounded-full transition-all active:scale-95 text-primary2 border border-primary2 ${
						imageUrl == "/" ? "opacity-0" : "opacity-100"
					}`}
					onClick={() => mint(imageUrl)}
					disabled={minting}
				>
					Mint{minting && "ing..."}
				</button>
			</div>
		</>
	);
}
