import { useState } from 'react';
import { ChatBubbleLeftIcon, CheckIcon, NoSymbolIcon, PencilSquareIcon, PlusCircleIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuthState } from '@src/context/auth';
import { users_rol_enum } from '@types/typesSSO';
interface Props {
    handleCheck?: () => void;    
    handleUnCheck?: () => void;    
    handleComment?: () => void;    
    handleDelete?: () => void;    
    handleNullify?: () => void;    
    handleEdit?: () => void;    
    handleCancelEdit?: () => void;    
    handleCustomAction?: () => void;
    customAction?: string;
    name?: string;
}

function Icons({ handleCheck, handleUnCheck, handleComment, handleDelete, handleNullify, handleEdit, handleCancelEdit, name,
handleCustomAction, customAction }: Props) {
  const {user} = useAuthState();
  const admin = user?.rol == users_rol_enum.ADMIN;
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
            ? <div className='flex flex-col items-center rounded-lg hover:text-red-600 hover:bg-red-100 ' onClick={()=>{
                setChecked(false); 
                handleUnCheck();
            }}>
                <XMarkIcon className="p-2 h-9 w-9" />
                {showMore && <p className="p-1 text-sm rounded-md">Reanudar {name}</p>}
            </div>
            : <div className='flex flex-col items-center rounded-lg hover:text-green-600 hover:bg-green-100 ' onClick={()=>{
                setChecked(true); 
                handleCheck();
            }}> 
                <CheckIcon className="p-2 h-9 w-9" />
                {showMore && <p className="p-1 text-sm rounded-md">Resolver {name}</p>}
            </div>
        }
        </div>}
        {/** Comentar SS */}
        {handleComment && (<div className='flex flex-col items-center hover:text-blue-600 hover:bg-blue-100'>
            <ChatBubbleLeftIcon onClick={handleComment} 
            className="p-2 h-9 w-9" />
            {showMore && <p className="p-1 text-sm rounded-md">Comentar {name}</p>}
            </div>
        )}
        {/** Editar SS */}
        {handleEdit && (
            <div className='flex flex-col items-center rounded-lg hover:text-blue-600 hover:bg-blue-100'> {edit 
            ? <XMarkIcon onClick={()=>{setEdit(false); handleCancelEdit && handleCancelEdit();}}
                className="p-2 h-9 w-9"
            />
            : <PencilSquareIcon onClick={()=> {setEdit(true); handleEdit();}}
                className="p-2 h-9 w-9"
            />}
            {showMore && <p className="p-1 text-sm rounded-md hover:bg-gray-200">Editar {name}</p>}
            </div>
        )}
        {/** Anular SS */}
        {handleNullify && <div className='flex flex-col items-center rounded-lg hover:text-red-600 hover:bg-red-100' onClick={handleNullify}>
            <TrashIcon className="p-2 h-9 w-9" />
            {showMore && <p className="p-1 text-sm rounded-md">Anular {name}</p>}
        </div>
        }
        {/** Eliminar SS */}
        {handleDelete && <div className='flex flex-col items-center rounded-lg hover:text-red-600 hover:bg-red-100' onClick={handleDelete}>
            <TrashIcon className="p-2 h-9 w-9" />
            {showMore && <p className="p-1 text-sm rounded-md">Eliminar {name}</p>}
        </div>
        }
        {/** Custom action */}
        {customAction && <div className='flex flex-col items-center rounded-lg hover:text-green-600 hover:bg-green-100' onClick={handleCustomAction}>
            <PlusCircleIcon className="p-2 h-9 w-9" />
            {showMore && <p className="p-1 text-sm rounded-md">{customAction} {name}</p>}
        </div>
        }

    </div>
  );
}

export default Icons;