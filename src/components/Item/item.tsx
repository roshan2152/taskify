import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import Modal from '../Modal/modal';
import { Button } from '../ui/button';
import { TicketType, itemType } from '@/types';

// type ItemType = {
//     id: UniqueIdentifier;
//     ticketName: string;
//     description: string;
//     comments: string;
//     assignee: '',
//     reporter: '',
//     createdAt: string,
// };
interface ItemsProps {  
    ticket: TicketType; 
    id: UniqueIdentifier;
    title: string;
};

const Items = ({  id,title,isOverlay }: any) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: 'item',
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                transition,
                transform: CSS.Translate.toString(transform),
            }}
            className={clsx(
                'px-2 py-4 bg-white shadow-md w-full border border-transparent hover:border-gray-200 cursor-pointer',
                isDragging && 'opacity-0', isOverlay && 'rotate-6'
            )}
        >
            <div className="flex items-center justify-between">
                {title}
            </div>
        </div>
    );
};

export default Items;
