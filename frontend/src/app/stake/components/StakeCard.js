import CustomLinkButton from "@/app/components/CustomLinkButton";
import Image from "next/image";

export default function StakeCard() {
	return (
		<div className="flex justify-between items-center max-w-[1440px] w-full  my-3  py-4 px-3 bg-bg3 backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg text-txt1  ">
			<div className="flex w-full gap-x-2 items-center justify-between text-txt2 ">
				<div className="flex items-center w-full gap-x-2 overflow-hidden">
					<p className="w-10% sm:w-[5%]">1</p>
					<div className="flex items-center gap-x-2 w-[100%] ">
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
				</div>

				<CustomLinkButton
					text="Stake"
					link="/"
					styles=" text-primary2 border border-primary2"
				/>
			</div>
		</div>
	);
}
