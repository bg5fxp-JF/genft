import ListingCard from "./ListingCard";

export default function Listings() {
	return (
		<section className="relative  flex flex-col gap-y-5 items-center w-full max-w-[1440px] min-h-screen gap-8  mx-auto px-6  bg-bg1 sm:px-16 ">
			<h3 className=" mt-24 text-3xl text-txt1 font-semibold text-center md:text-6xl ">
				Curre<span className="text-primary1">n</span>t Listi
				<span className="text-primary1">n</span>gs
			</h3>
			<div className="w-full ">
				<div className="flex w-full gap-x-2 px-3 text-txt2 ">
					<p className="w-10% sm:w-[5%]">#</p>
					<p className="w-[60%] sm:w-[50%]">Name</p>
					<p className="w-[30%]">Owner</p>
					<p className="w-[10%]">URI</p>
				</div>
				<hr className="w-full" />
			</div>
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
			<ListingCard />
		</section>
	);
}
