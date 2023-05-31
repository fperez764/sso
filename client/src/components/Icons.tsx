import { useState } from 'react';
import { ChatBubbleLeftIcon, CheckIcon, NoSymbolIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
interface Props {
    handleCheck?: () => void;    
    handleUnCheck?: () => void;    
    handleComment?: () => void;    
    handleDelete?: () => void;    
    handleNullify?: () => void;    
    handleEdit?: () => void;    
    handleCancelEdit?: () => void;    
    name?: string;
}

function Icons({ handleCheck, handleUnCheck, handleComment, handleDelete, handleNullify, handleEdit, handleCancelEdit, name }: Props) {
  const [checked, setChecked] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="flex justify-around p-0 text-gray-500"                 
    onMouseEnter={() => setShowMore(true)}
    onMouseLeave={()=> setShowMore(false)}
    >
        {/** Resolver */}
        {handleCheck && <div className="flex items-center">
            {checked && handleUnCheck
            ? <div className='flex flex-col items-center'>
                <XMarkIcon className="p-2 text-red-600 h-9 w-9 hoverEffect hover:bg-red-100" onClick={()=>{
                    setChecked(false); 
                    handleUnCheck();
                }} />
                {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Reanudar {name}</p>}
            </div>
            : <div className='flex flex-col items-center'> 
                <CheckIcon className="p-2 h-9 w-9 hoverEffect hover:text-green-600 hover:bg-green-100" onClick={()=>{
                    setChecked(true); 
                    handleCheck();
                }} />
                {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Resolver {name}</p>}
            </div>
        }
        </div>}
        {/** Comentar SS */}
        {handleComment && (<div className='flex flex-col items-center'>
            <ChatBubbleLeftIcon onClick={handleComment} 
            className="p-2 h-9 w-9 hoverEffect hover:text-sky-500 hover:bg-sky-100" />
            {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Comentar {name}</p>}
            </div>
        )}
        {/** Editar SS */}
        {handleEdit && (
            <div className='flex flex-col items-center'> {edit 
            ? <XMarkIcon onClick={()=>{setEdit(false); handleCancelEdit && handleCancelEdit();}}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
            : <PencilSquareIcon onClick={()=> {setEdit(true); handleEdit();}}
                className="p-2 h-9 w-9 hoverEffect hover:text-blue-600 hover:bg-red-100"
            />}
            {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Editar {name}</p>}
            </div>
        )}
        {/** Anular SS */}
        {handleNullify && <div className='flex flex-col items-center'>
            <NoSymbolIcon
                onClick={handleNullify}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
            {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Anular {name}</p>}
        </div>
        }
        {/** Eliminar SS */}
        {handleDelete && <div className='flex flex-col items-center'>
            <TrashIcon onClick={handleDelete}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
            {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Eliminar {name}</p>}
        </div>
        }
    </div>
  );
}

export default Icons;