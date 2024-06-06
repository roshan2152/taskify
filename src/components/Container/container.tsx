import React from 'react';
import ContainerProps from './container.type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { deleteColumn } from '@/backend/boards';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Container = ({
    id,
    boardId,
    children,
    title,
    description,
    onAddItem,
}: ContainerProps) => {
    const {
        attributes,
        setNodeRef,
        // listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: 'container',
        },
    });

    const handleContainerDelete = async () => {

        try {
            await deleteColumn(boardId, String(id));
            toast.success('Column deleted successfully');
        } catch (err) {
            console.log('Error in adding container', err)
        }
    }

    return (
        <div
            {...attributes}
            // {...listeners}
            ref={setNodeRef}
            style={{
                transition,
                transform: CSS.Translate.toString(transform),
            }}
            className={clsx(
                'w-[17rem] relative h-full bg-gray-100 dark:bg-[#1F1F1F] dark:text-white rounded-xl flex flex-col gap-y-4 max-h-[65vh] overflow-y-auto',
                isDragging && 'opacity-0',
            )}
        >
            <div className="flex items-center justify-between sticky top-0 bg-slate-200 w-full shadow-md z-10">
                <div className="flex flex-col gap-y-1 w-full ">
                    <div className='flex w-full justify-between items-center p-2'>
                        <h1 className="text-gray-800 text-xl">{title}</h1>
                        <Button onClick={handleContainerDelete} className='bg-transparent hover:bg-slate-400'>
                            <Trash2 color='black' size={15} />
                        </Button>
                    </div>
                    <p className="text-gray-400 text-sm">{description}</p>
                </div>
            </div>

            <div className='pt-2 mx-1'>
                {children}
            </div>

            <Button variant="ghost" onClick={onAddItem} className='sticky bottom-0 bg-slate-200'>
                +  Create issue
            </Button>
        </div>
    );
};

export default Container;