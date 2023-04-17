interface Props {
    children: any;
}

function Widgets({ children }: Props) {
    return (
        <div className="w-full px-2 py-3 space-y-5 overflow-x-hidden">
            {children}
        </div>
    );
}

export default Widgets;
