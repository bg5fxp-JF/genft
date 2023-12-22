"use client";
import { motion } from "framer-motion";
import { imgs } from "../constants/constants";
import CustomLinkButton from "./CustomLinkButton";
import MouseImageTrail from "./MouseImageTrail";

export default function Hero() {
	return (
		<MouseImageTrail renderImageBuffer={50} rotationRange={25} images={imgs}>
			<section className="relative  flex flex-col items-center justify-center w-full max-w-[1440px] min-h-screen max-h-screen gap-8  mx-auto px-6  bg-bg1 sm:px-16 ">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="relative flex flex-col pb-6  z-40"
				>
					<h3 className="text-4xl text-txt1 font-semibold text-center md:text-6xl ">
						Ge<span className="text-primary1">N</span>FT
					</h3>
					<p className="my-4 capitalize text-center text-txt2 md:text-lg md:my-6 p-1 rounded bg-bg1 backdrop-filter backdrop-blur-sm bg-opacity-10">
						Generate NFT's based on your prompt and stake them for rewards
					</p>
					<div className="flex gap-x-4 mx-auto mt-4 ">
						<CustomLinkButton
							text="Mint"
							link="/mint"
							styles=" text-white bg-gradient-160 from-primary2 from-20% to-primary1"
						/>
						<CustomLinkButton
							text="Stake"
							link="/"
							styles="  text-primary2 border border-primary2 "
						/>
					</div>
				</motion.div>
			</section>
		</MouseImageTrail>
	);
}
