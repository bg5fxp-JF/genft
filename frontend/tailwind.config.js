/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		screens: {
			xxs: "375px",
			xs: "380px",
			sm: "480px",
			md: "768px",
			lg: "976px",
			xl: "1440px",
		},
		fontFamily: {
			Poppins: ["Poppins", "sans-serif"],
		},
		fontSize: {
			"2xsm": "10px",
			xsm: "12px",
			sm: "13px",
			reg: "15px",
			lg: "18px",
			"2xl": "22px",
			"3xl": "25px",
			"4xl": "32px",
			"5xl": "40px",
			"6xl": "50px",
			"7xl": "70px",
			"8xl": "80px",
			"9xl": "80px",
			"10xl": "100px",
		},
		extend: {
			colors: {
				bg1: "#1D1F21",
				bg2: "#2c2e30",
				bg3: "#444648",
				primary1: "#FF6600",
				primary2: "#ff983f",
				primary3: "#ffffa1",
				accent1: "#F5F5F5",
				accent2: "#929292",
				txt1: "#FFFFFF",
				txt2: "#e0e0e0",
			},
			backgroundImage: {
				"gradient-160": "linear-gradient(160deg, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [],
};
