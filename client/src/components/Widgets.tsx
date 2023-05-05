/** @format */

interface Props {
	children: any;
}

function Widgets({ children }: Props) {
	return <div className="w-full max-h-screen px-2 py-3 space-y-5 overflow-x-scroll">{children}</div>;
}

export default Widgets;
