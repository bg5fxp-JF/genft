import axiosRetry from "axios-retry";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
	const searchParams = request.nextUrl.searchParams;
	const sourceUrl = searchParams.get("sourceUrl");
	const axiosInstance = axios.create();
	axiosRetry(axiosInstance, { retries: 5 });

	try {
		// const response = await axiosInstance(sourceUrl, {
		// 	method: "GET",
		// 	responseType: "arraybuffer",
		// });

		const response = await fetch(sourceUrl);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.arrayBuffer();

		// return res.status(200).json({ sourceUrl: sourceUrl });

		// return new Response(Buffer.from(data));
		return new NextResponse(data);
	} catch (err) {
		return NextResponse.json({ error: err.message });
	}
}
