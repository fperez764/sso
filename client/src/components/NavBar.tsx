import { ArrowPathIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import ExportButton from '../components/ExportButton';
import Button from './Button';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react';

interface Props {
    title: string;
    searchEndpoint?: string;
    handleRefresh: () => void;
    data: any;
    setData: any;
    filterKey: string[] | string;
    filterKeyId?: string;
    children?:any;
}

export default function NavBar({ children, title, searchEndpoint, handleRefresh, filterKey, data, setData, filterKeyId}:Props) {
   
    return (
    <div className="sticky top-0 z-50 flex items-center bg-gray-100 border-b border-gray-200">
        <h2 className="text-lg font-bold sm:text-xl pl-2 w-1/3">
            {title}
        </h2>
        <div className="flex flex-col w-full">
        <SearchBar 
            postName = {title} 
            searchEndpoint={searchEndpoint} 
            filterKey={filterKey} 
            data={data} 
            setData={setData} 
            filterKeyId={filterKeyId || 'id'}
            searchCustom={handleRefresh}
        >
        {children}
        </SearchBar>
        </div>
        <div className="flex items-center justify-center px-1 mx-1 w-1/6">
            <Button Icon={ArrowPathIcon} onClick={handleRefresh} disabled={!handleRefresh}/>
            <ExportButton title={title.replace(' ','')} data={data}/>
        </div>
    </div>  
  );
}

