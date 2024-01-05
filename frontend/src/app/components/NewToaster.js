"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const contextClass = {
	success: "bg-blue-600",
	error: "bg-red-600",
	info: "bg-gray-600",
	warning: "bg-orange-400",
	default: "bg-indigo-600",
	dark: "bg-white-600 font-gray-300",
};
export default function NewToaster() {
	return (
		<ToastContainer
			toastClassName={() =>
				"relative flex p-3 bg-bg2 rounded-md justify-between overflow-hidden cursor-pointer"
			}
			// bodyClassName={() => "text-sm font-white font-med  p-3"}
			// progressClassName={() => "text-primary1 h-5 bg-primary1"}
		/>
	);
}
