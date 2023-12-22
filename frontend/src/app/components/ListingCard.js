"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function ListingCard() {
	function formatAddress(address) {
		return address.slice(0, 20) + "..." + address.slice(address.length - 4);
	}
	return (
		<motion.div
			initial={{ opacity: 0, scale: 2 }}
			whileInView={{ opacity: 1, scale: 1 }}
			transition={{ delay: 0.5 }}
			viewport={{ once: true }}
			className="flex justify-between items-center max-w-[1440px] w-full  my-3  py-4 px-3 bg-bg3 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg text-txt1  "
		>
			<div className="flex w-full gap-x-2 items-center text-txt2 ">
				<p className="w-10% sm:w-[5%]">1</p>
				<div className="flex items-center gap-x-2 w-[50%]">
					<Image
						src="https://img.freepik.com/free-photo/view-funny-monkey-with-sunglasses_23-2150758372.jpg?uid=R131559868&semt=ais_ai_generated"
						alt=""
						width={30}
						height={30}
						className="object-cover w-12 h-12 rounded"
					/>

					<p className=" truncate">
						Coolest monkey to ever live in the world galaxy and all that
					</p>
				</div>
				<p className="w-[30%] truncate">
					{formatAddress("0xcc6cfe1a015ecce15176bfabaa2473728da0898f")}
				</p>
				<Link
					href="/"
					className="hidden w-[10%] text-primary1 transition-all hover:underline md:flex"
				>
					View NFT
				</Link>
				<Link
					href="/"
					className="flex w-[10%] text-primary1 transition-all hover:underline md:hidden"
				>
					<FaExternalLinkAlt />
				</Link>
			</div>
		</motion.div>
	);
}
