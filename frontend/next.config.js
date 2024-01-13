/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.freepik.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "oaidalleapiprodscus.blob.core.windows.net",
				port: "",
			},
			{
				protocol: "https",
				hostname: "salmon-faithful-giraffe-726.mypinata.cloud",
				port: "",
			},
		],
	},
};

module.exports = nextConfig;
