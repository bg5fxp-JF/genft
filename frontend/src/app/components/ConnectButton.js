"use client";
import { useEffect } from "react";
// import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { IoExitOutline } from "react-icons/io5";

export default function ConnectButton({ stylesDisconnected, stylesConnected }) {
	function formatAddress(address) {
		return address.slice(0, 6) + "..." + address.slice(address.length - 4);
	}

	// const { connect } = useConnect({
	// 	connector: new MetaMaskConnector(),
	// });
	// const { disconnect } = useDisconnect();

	// const { address, isConnected } = useAccount();

	// useEffect(() => {
	// 	if (isConnected) return;
	// 	if (typeof window !== "undefined") {
	// 		if (window.localStorage.getItem("connected")) {
	// 			connect();
	// 		}
	// 	}
	// }, [address]);

	const isConnected = false;

	if (isConnected) {
		return (
			<div
				className={`${stylesConnected} rounded-full border-2 border-l-0 border-primaryColor items-center `}
			>
				<button
					onClick={() => {
						// disconnect();
						// window.localStorage.removeItem("connected");
					}}
					className="rounded-full w-10 h-8 bg-primaryColor"
				>
					<IoExitOutline
						stroke="#fff"
						className=" mx-auto transition-all hover:scale-125"
					/>
				</button>

				<p className="text-reg p-1 px-2">{formatAddress(address)}</p>
			</div>
		);
	}

	return (
		<button
			// onClick={() => {
			// 	connect();
			// 	window.localStorage.setItem("connected", "inject");
			// }}
			className={`text-reg flex  px-4 py-2  rounded-full transition-all active:scale-95 ${stylesDisconnected} `}
		>
			Connect Wallet
		</button>
	);
}
