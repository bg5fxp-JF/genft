import MobileNav from "./components/MobileNav";
import Navbar from "./components/Navbar";
import NewToaster from "./components/NewToaster";
import MobileNavContextProvider from "./contexts/MobileNavContextProvider";
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
	title: "GeNFT",
	description: "Generate NFT's based on your prompt and stake them for rewards",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<MobileNavContextProvider>
						<Navbar />
						<MobileNav />
					</MobileNavContextProvider>
					{children}
					<NewToaster />
				</Providers>
			</body>
		</html>
	);
}
