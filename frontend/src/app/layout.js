import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
	title: "GeNFT",
	description: "Generate NFT's based on your prompt and stake them for rewards",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
