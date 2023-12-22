import ImageMint from "./components/ImageMint";

export const metadata = {
	title: "GeNFT | Mint Your NFT",
	description: "Generate NFT's based on your prompt and stake them for rewards",
};

export default function page() {
	return (
		<section className="relative  flex flex-col items-center  w-full max-w-[1440px] min-h-screen gap-8  mx-auto px-6  bg-bg1 sm:px-16 ">
			<div className="relative flex flex-col w-full max-w-[550px] gap-y-4 mt-32 pb-6  z-40">
				<h3 className="text-4xl text-txt1 font-semibold text-center md:text-6xl ">
					Ge<span className="text-primary1">n</span>erate & Mi
					<span className="text-primary1">n</span>t
				</h3>

				<ImageMint />
			</div>
		</section>
	);
}
