import React from 'react';
import ContainerProps from './container.type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';

const Container = ({
    id,
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
                <div className="flex flex-col gap-y-1 ">
                    <h1 className="text-gray-800 text-xl p-2">{title}</h1>
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