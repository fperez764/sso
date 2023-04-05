interface Props {
    children: any;
}

function Widgets({ children }: Props) {
    return (
        <div className="hidden w-full px-2 py-3 space-y-5 overflow-x-hidden md:inline">
            {children}
        </div>
    );
}

export default Widgets;
