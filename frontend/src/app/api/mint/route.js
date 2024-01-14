import axiosRetry from "axios-retry";
import axios from "axios";
import { NextResponse } from "next/server";
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, deleteObject } from "firebase/storage";

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
		const blob = await response.blob();
		// const buffer = Buffer.from(await blob.arrayBuffer());

		// const data = await response.arrayBuffer();

		// return res.status(200).json({ sourceUrl: sourceUrl });

		// return new Response(Buffer.from(data));
		return new NextResponse(blob);
	} catch (err) {
		return NextResponse.json({ error: err.message });
	}
}
