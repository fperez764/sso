import React, { useState } from 'react'
import { ChatBubbleLeftIcon, CheckIcon, NoSymbolIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
interface Props {
    handleCheck?: () => void;    
    handleComment?: () => void;    
    handleDelete?: () => void;    
    handleNullify?: () => void;    
    handleEdit?: () => void;    
    handleCancelEdit?: () => void;    
}

function Icons({handleCheck, handleComment, handleDelete, handleNullify, handleEdit, handleCancelEdit}: Props) {
  const [checked, setChecked] = useState(false);
  const [edit, setEdit] = useState(false);

  return (
    <div className="flex justify-around p-0 text-gray-500">
        {/** Responder SS */}
        {handleCheck && <div className="flex items-center">
            {checked 
            ? <XMarkIcon className="p-2 text-red-600 h-9 w-9 hoverEffect hover:bg-red-100" onClick={()=>{
                setChecked(false); 
                handleCheck();
            }} />
            : <CheckIcon className="p-2 h-9 w-9 hoverEffect hover:text-green-600 hover:bg-green-100" onClick={()=>{
                setChecked(true); 
                handleCheck();
            }} />}
        </div>}
        {/** Comentar SS */}
        {handleComment && (
            <ChatBubbleLeftIcon onClick={handleComment} 
            className="p-2 h-9 w-9 hoverEffect hover:text-sky-500 hover:bg-sky-100" />
        )}
        {/** Editar SS */}
        {handleEdit && (edit 
            ? <XMarkIcon onClick={()=>{setEdit(false); handleCancelEdit && handleCancelEdit();}}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
            : <PencilSquareIcon onClick={()=> {setEdit(true); handleEdit();}}
                className="p-2 h-9 w-9 hoverEffect hover:text-blue-600 hover:bg-red-100"
            />
        )}
        {/** Anular SS */}
        {handleNullify &&
            <NoSymbolIcon
                onClick={handleNullify}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
        }
        {/** Eliminar SS */}
        {handleDelete &&
            <TrashIcon onClick={handleDelete}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
        }
    </div>
  );
}

export default Icons;