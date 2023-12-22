"use client";
import Image from "next/image";

import { useState } from "react";
import OpenAI from "openai";
import Loader from "./Loader";
import CustomLinkButton from "@/app/components/CustomLinkButton";

export default function ImageMint() {
	const isConnected = true;
	const openai = new OpenAI({
		apiKey: process.env.NEXT_PUBLIC_OPEN_AI,
		dangerouslyAllowBrowser: true,
	});

	const [imageUrl, setImageUrl] = useState("/");
	const [userPrompt, setUserPrompt] = useState("");
	const [generatingImg, setGeneratingImg] = useState(false);
	function handlePromptChange(e) {
		setUserPrompt(e.target.value);
		console.log(prompt);
		// formatFormData(formData);
	}

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
					"https://oaidalleapiprodscus.blob.core.windows.net/private/org-Sh4klIMQC1yCCn287953rOWd/user-xmseufWOKmj6UTNcNqlrZWcL/img-92xRJt20q29BPayzueKyf6KG.png?st=2023-12-22T14%3A04%3A40Z&se=2023-12-22T16%3A04%3A40Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-21T23%3A12%3A05Z&ske=2023-12-22T23%3A12%3A05Z&sks=b&skv=2021-08-06&sig=8e48BouNj2vNML4dmll%2BxkL43W48zKxG9sj4weC6Qc4%3D"
				);
				setGeneratingImg(false);
			}, 2000);

			// image_url = response;
			// setImageUrl(response.data[0].url);

			// setGeneratingImg(false);
		}
	}
	return (
		<>
			<div className="relative bg-bg2   text-gray-900 text-sm rounded-lg w-64 mx-auto p-3 h-64 flex justify-center items-center">
				{imageUrl != "/" ? (
					<Image
						src={imageUrl}
						alt={prompt}
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
				<CustomLinkButton
					text="Mint"
					link="/"
					styles={`text-primary2 border border-primary2 transition-all ${
						imageUrl == "/" ? "opacity-0" : "opacity-100"
					}`}
				/>
			</div>
		</>
	);
}
