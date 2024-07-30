import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import Modal from '../Modal/modal';
import { Button } from '../ui/button';
import { TicketType, itemType } from '@/types';
import { Trash2 } from 'lucide-react';

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

const Items = ({ id, title, isOverlay }: any) => {

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
                isDragging && 'opacity-0',
            )}
        >
            <div className="flex items-center justify-between">
                <span>{title}</span>
                <Button
                    // onClick={() => onDelete(id)}
                    className='top-2 right-2 bg-transparent hover:bg-slate-400'
                >
                    <Trash2 color='black' size={15} />
                </Button>
            </div>
        </div>
    );
};

export default Items;
