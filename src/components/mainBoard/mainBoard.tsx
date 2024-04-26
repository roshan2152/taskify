import React, { useState } from 'react'
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    UniqueIdentifier,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

export default function MainBoard() {

    const [containers, setContainers] = useState<DNDType[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();
    const [containerName, setContainerName] = useState('');
    const [itemName, setItemName] = useState('');
    const [showAddContainerModal, setShowAddContainerModal] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);


    type DNDType = {
        id: UniqueIdentifier;
        title: string;
        items: {
            id: UniqueIdentifier;
            title: string
        }[]
    }

    // DND Handlers
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragStart = (event: DragStartEvent) => { };
    const handleDragMove = (event: DragMoveEvent) => { };
    const handleDragEnd = (event: DragEndEvent) => { };

    return (
        <div className='border-2 border-black h-full overflow-x-auto'>
            <div>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={containers.map(container => container.id)}>
                        {containers.map()}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    )
}
