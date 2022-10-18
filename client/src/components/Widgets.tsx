import Image from 'next/image';
import { useState } from 'react';
import News from './News';
import SearchBar from './SS/SearchBar';

interface Props {
    showSearchBar: boolean;
    children: any;
}

function Widgets({ showSearchBar, children }: Props) {
    return (
        <div className="xl:w-[600px] hidden lg:inline mt-2 ml-8 space-y-5">
            {showSearchBar && <SearchBar />}
            {children}
        </div>
    );
}

export default Widgets;
