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
import { toast } from "react-toastify";
import { useContractEvent } from "wagmi";

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
		account: address,
		watch: true,
	});

	const { write: stake } = useContractWrite({
		address: stakingAddress,
		abi: staking_abi,
		functionName: "stake",
		args: [tokenId],
		onError(error) {
			toast.error(error.message);
		},
		onSuccess() {
			toast.success(`Successfully Staked Genft Artists #${tokenId}`);
		},
	});
	const { write: unstake } = useContractWrite({
		address: stakingAddress,
		abi: staking_abi,
		functionName: "unstake",
		args: [tokenId],
		onError(error) {
			toast.error(error.message);
		},
		onSuccess() {
			toast.success(
				`Successfuly Unstaked Genft Artists #${tokenId}. Rewards Sent.`
			);
		},
	});
	const { write: approve } = useContractWrite({
		address: genftAddress,
		abi: genft_abi,
		functionName: "approve",
		args: [stakingAddress, tokenId],
		onError(error) {
			toast.error(error.message);
		},
		onSuccess() {
			stake();
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
			}}
			className={`text-reg flex  px-4 py-2  rounded-full transition-all active:scale-95 text-primary2 border border-primary2 `}
		>
			Stake
		</button>
	);
}
