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
}

function Icons({ handleCheck, handleUnCheck, handleComment, handleDelete, handleNullify, handleEdit, handleCancelEdit }: Props) {
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
            ? <div>
                <XMarkIcon className="p-2 text-red-600 h-9 w-9 hoverEffect hover:bg-red-100" onClick={()=>{
                    setChecked(false); 
                    handleUnCheck();
                }} />
                {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Reanudar</p>}
            </div>
            : <div> 
                <CheckIcon className="p-2 h-9 w-9 hoverEffect hover:text-green-600 hover:bg-green-100" onClick={()=>{
                    setChecked(true); 
                    handleCheck();
                }} />
                {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Resolver</p>}
            </div>
        }
        </div>}
        {/** Comentar SS */}
        {handleComment && (<div>
            <ChatBubbleLeftIcon onClick={handleComment} 
            className="p-2 h-9 w-9 hoverEffect hover:text-sky-500 hover:bg-sky-100" />
            {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Comentar</p>}
            </div>
        )}
        {/** Editar SS */}
        {handleEdit && (
            <div> {edit 
            ? <XMarkIcon onClick={()=>{setEdit(false); handleCancelEdit && handleCancelEdit();}}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
            : <PencilSquareIcon onClick={()=> {setEdit(true); handleEdit();}}
                className="p-2 h-9 w-9 hoverEffect hover:text-blue-600 hover:bg-red-100"
            />}
            {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Editar</p>}
            </div>
        )}
        {/** Anular SS */}
        {handleNullify && <div>
            <NoSymbolIcon
                onClick={handleNullify}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
            {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Anular</p>}
        </div>
        }
        {/** Eliminar SS */}
        {handleDelete && <div>
            <TrashIcon onClick={handleDelete}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
            {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Eliminar</p>}
        </div>
        }
    </div>
  );
}

export default Icons;