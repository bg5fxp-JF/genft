import Image from "next/image";
import StakeButton from "./StakeButton";

export default function StakeCard({ tokenId, img, desc }) {
	return (
		<div className="flex justify-between items-center max-w-[1440px] w-full  my-3  py-4 px-3 bg-bg3 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg text-txt1  ">
			<div className="flex w-full gap-x-2 items-center justify-between text-txt2 ">
				<div className="flex items-center w-full gap-x-2 overflow-hidden">
					<p className="w-10% sm:w-[5%]">{tokenId}</p>
					<div className="flex items-center gap-x-2 w-[100%] ">
						<Image
							src={img}
							alt=""
							width={30}
							height={30}
							className="object-cover w-12 h-12 rounded"
						/>

						<p className=" truncate">{desc}</p>
					</div>
				</div>

				<StakeButton tokenId={tokenId} />
			</div>
		</div>
	);
}
