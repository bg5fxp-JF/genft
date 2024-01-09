"use client";
import Link from "next/link";
import ConnectButton from "./ConnectButton";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
	const pathname = usePathname();
	return (
		<header className=" absolute flex justify-center w-full z-50">
			<motion.nav
				initial={
					pathname == "/" ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }
				}
				animate={{ opacity: 1, y: 0 }}
				className="flex justify-between items-center max-w-[1440px] w-full mx-3 my-3 px-3 py-4 bg-bg3 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg text-txt1 sm:px-8 sm:mx-8"
			>
				<div className="flex gap-x-10 items-center justify-between ">
					<Link href="/" className="text-2xl font-bold">
						Ge<span className="text-primary1">N</span>FT
					</Link>
					<div className="hidden gap-x-5 text-accent1 md:flex ">
						<div className="border-l-2 border-accent1"></div>

						<Link href="/mint" className="text-reg">
							Mint
						</Link>
						<Link href="/stake" className="text-reg ">
							Stake
						</Link>
					</div>
				</div>
				<ConnectButton
					stylesDisconnected="hidden text-white bg-gradient-160 from-primary2 from-20% to-primary1 md:flex "
					stylesConnected="hidden md:flex"
				/>
			</motion.nav>
		</header>
	);
}
