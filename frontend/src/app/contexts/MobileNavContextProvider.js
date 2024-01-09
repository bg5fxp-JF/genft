"use client";
import { createContext, useState } from "react";

export const MobileContext = createContext(null);

export default function MobileNavContextProvider({ children }) {
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

	return (
		<MobileContext.Provider value={[isMobileNavOpen, setIsMobileNavOpen]}>
			{children}
		</MobileContext.Provider>
	);
}
