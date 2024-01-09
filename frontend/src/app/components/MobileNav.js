"use client";
import Link from "next/link";
import React, { useContext } from "react";
import ConnectButton from "./ConnectButton";
import { IoCloseOutline } from "react-icons/io5";
import { MobileContext } from "../contexts/MobileNavContextProvider";
import { AnimatePresence, motion } from "framer-motion";

export default function MobileNav() {
	const [isOpen, setIsOpen] = useContext(MobileContext);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ x: 800 }}
					animate={{ x: 0 }}
					transition={{ type: "easeInOut" }}
					exit={{ x: 800 }}
					className="fixed flex flex-col gap-5 items-center w-screen h-screen z-50 p-14 bg-bg1 text-white"
				>
					<IoCloseOutline
						size={30}
						className="absolute top-7 right-7 cursor-pointer"
						fill="white"
						onClick={() => {
							setIsOpen(false);
						}}
					/>
					<Link
						href="/"
						className="text-4xl font-bold"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						Ge<span className="text-primary1">N</span>FT
					</Link>
					<div className="flex flex-col gap-y-2 text-accent1 text-center text-lg mb-20 ">
						<Link
							href="/mint"
							className="text-reg"
							onClick={() => {
								setIsOpen(false);
							}}
						>
							Mint
						</Link>
						<Link
							href="/stake"
							className="text-reg "
							onClick={() => {
								setIsOpen(false);
							}}
						>
							Stake
						</Link>
					</div>
					<ConnectButton
						stylesDisconnected="flex text-white bg-gradient-160 from-primary2 from-20% to-primary1 "
						stylesConnected="flex"
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
