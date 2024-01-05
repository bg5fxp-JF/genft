"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function ListingCard({ uri, tokenId, img, desc, owner }) {
	function formatAddress(address) {
		if (address == "You") return address;
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
				<p className="w-10% sm:w-[5%]">{tokenId}</p>
				<div className="flex items-center gap-x-2 w-[50%]">
					<Image
						src={img}
						alt=""
						width={30}
						height={30}
						className="object-cover w-12 h-12 rounded"
					/>

					<p className=" truncate">{desc}</p>
				</div>
				<p className="w-[30%] truncate">{formatAddress(owner)}</p>
				<Link
					href={uri}
					className="hidden w-[10%] text-primary1 transition-all hover:underline md:flex"
				>
					View NFT
				</Link>
				<Link
					href={uri}
					className="flex w-[10%] text-primary1 transition-all hover:underline md:hidden"
				>
					<FaExternalLinkAlt />
				</Link>
			</div>
		</motion.div>
	);
}
