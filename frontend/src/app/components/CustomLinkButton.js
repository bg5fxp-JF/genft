import Link from "next/link";

export default function CustomLinkButton({ text, styles, link }) {
	return (
		<Link
			href={link || "/"}
			className={`text-reg flex  px-4 py-2 rounded-full transition-all active:scale-95 ${styles} `}
		>
			{text}
		</Link>
	);
}
