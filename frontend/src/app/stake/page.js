import StakeCard from "./components/StakeCard";

export default function page() {
	const isConnected = true;
	const nfts = 1;

	if (!isConnected) {
		return (
			<section className="relative  flex flex-col items-center justify-center w-full max-w-[1440px] min-h-screen  gap-8  mx-auto px-6  bg-bg1 sm:px-16 ">
				<h3 className="text-4xl text-txt1 font-semibold text-center md:text-6xl ">
					Co<span className="text-primary1">nn</span>ect Wallet To Stake
				</h3>
			</section>
		);
	}
	if (isConnected && nfts == 0) {
		return (
			<section className="relative  flex flex-col items-center justify-center w-full max-w-[1440px] min-h-screen  gap-8  mx-auto px-6  bg-bg1 sm:px-16 ">
				<h3 className="text-4xl text-txt1 font-semibold text-center md:text-6xl ">
					Mi<span className="text-primary1">n</span>t Some{" "}
					<span className="text-primary1">N</span>FTs To Stake
				</h3>
			</section>
		);
	}
	return (
		<section className="relative  flex flex-col items-center  w-full max-w-[1440px] min-h-screen gap-8  mx-auto px-6  bg-bg1 sm:px-16 ">
			<div className="relative flex flex-col w-full max-w-[550px] gap-y-4 mt-32 pb-6  z-40">
				<h3 className="text-4xl text-txt1 font-semibold text-center md:text-6xl ">
					Stake Your <span className="text-primary1">N</span>FTs
				</h3>
			</div>
			<StakeCard />
			<StakeCard />
			<StakeCard />
		</section>
	);
}
