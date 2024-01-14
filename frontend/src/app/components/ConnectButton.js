"use client";
import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { IoExitOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ConnectButton({ stylesDisconnected, stylesConnected }) {
	function formatAddress(address) {
		return address.slice(0, 6) + "..." + address.slice(address.length - 4);
	}

	const { connect, connectors } = useConnect({
		connector: new MetaMaskConnector(),
	});
	const { disconnect } = useDisconnect();

	const { address, isConnected } = useAccount();
	const { chain } = useNetwork();

	const chainId = isConnected ? chain.id : 0;

	useEffect(() => {
		if (isConnected) return;
		if (typeof window !== "undefined") {
			if (window.localStorage.getItem("connected")) {
				connect();
			}
		}
	}, [address]);

	useEffect(() => {
		if (isConnected && chainId != 11155111) {
			toast.warn(
				`Currently connected to the ${chain.name} Network. Change to Sepolia Test Network (11155111)`
			);
		}
	}, [chainId]);

	// const isConnected = false;

	if (isConnected) {
		return (
			<div className={`${stylesConnected} rounded-full items-center `}>
				<button
					onClick={() => {
						disconnect();
						window.localStorage.removeItem("connected");
					}}
					className="rounded-full w-10 h-8 bg-gradient-160 from-primary2 from-20% to-primary1"
				>
					<IoExitOutline
						stroke="#fff"
						className=" mx-auto transition-all hover:scale-125"
					/>
				</button>

				<p className="text-reg p-2 px-2">{formatAddress(address)}</p>
			</div>
		);
	}

	return (
		<button
			onClick={() => {
				if (!connectors[0].ready) {
					toast.warn(
						<div>
							Metamask Is Not Installed.{" "}
							<Link
								href="https://metamask.io/download/"
								className="text-primary1 transition-all hover:underline "
							>
								Install Here!
							</Link>
						</div>
					);
				} else {
					connect();
					window.localStorage.setItem("connected", "inject");
				}
			}}
			className={`text-reg flex  px-4 py-2  rounded-full transition-all active:scale-95 ${stylesDisconnected} `}
		>
			Connect Wallet
		</button>
	);
}
