"use client";

import { genft_abi, staking_abi } from "@/app/constants/abis";
import {
	genft_contractAddresses,
	staking_contractAddresses,
} from "@/app/constants/contracts";
import {
	useAccount,
	useContractRead,
	useContractWrite,
	useNetwork,
} from "wagmi";

export default function StakeButton({ tokenId }) {
	const { address, isConnected } = useAccount();
	const { chain } = useNetwork();

	const chainId = isConnected ? chain.id : 0;
	const stakingAddress =
		chainId in staking_contractAddresses
			? staking_contractAddresses[chainId][0]
			: null;
	const genftAddress =
		chainId in genft_contractAddresses
			? genft_contractAddresses[chainId][0]
			: null;

	const { data: isStaked } = useContractRead({
		address: stakingAddress,
		abi: staking_abi,
		functionName: "getIsStaked",
		args: [tokenId],
		watch: true,
	});
	const { write: approve } = useContractWrite({
		address: genftAddress,
		abi: genft_abi,
		functionName: "approve",
		args: [stakingAddress, tokenId],
		onError(error) {
			window.alert(error.message);
		},
	});
	const { write: stake } = useContractWrite({
		address: stakingAddress,
		abi: staking_abi,
		functionName: "stake",
		args: [tokenId],
		onError(error) {
			window.alert(error.message);
		},
		onSuccess() {
			window.alert("Success Stake");
		},
	});
	const { write: unstake } = useContractWrite({
		address: stakingAddress,
		abi: staking_abi,
		functionName: "unstake",
		args: [tokenId],
		onError(error) {
			window.alert(error.message);
		},
		onSuccess() {
			window.alert("Success UnStake");
		},
	});

	if (isStaked) {
		return (
			<button
				onClick={() => {
					unstake();
				}}
				className={`text-reg flex  px-4 py-2  rounded-full transition-all active:scale-95 text-primary2 border border-primary2 `}
			>
				Unstake
			</button>
		);
	}

	return (
		<button
			onClick={() => {
				approve();
				stake();
			}}
			className={`text-reg flex  px-4 py-2  rounded-full transition-all active:scale-95 text-primary2 border border-primary2 `}
		>
			Stake
		</button>
	);
}
