import Image from 'next/image';
import { useState } from 'react';
import News from './News';
import SearchBar from './SS/SearchBar';

interface Props {
    children: any;
}

function Widgets({ children }: Props) {
    return (
        <div className=" hidden lg:inline space-y-5 overflow-x-hidden">
            {children}
        </div>
    );
}

export default Widgets;
