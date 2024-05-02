import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

import {
    DndContext,
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
import Container from '@/components/Container/container';
import Items from '@/components/Item/item';
import Modal from '@/components/Modal/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { addColumn } from '@/backend/boards';
import { addTicket } from '@/backend/tickets';
import { Plus, PlusCircle } from 'lucide-react';

type DNDType = {
    id: UniqueIdentifier;
    title: string;
    items: {
        id: UniqueIdentifier;
        title: string
    }[]
}

export default function MainBoard() {

    const [containers, setContainers] = useState<DNDType[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [currentContainerId, setCurrentContainerId] =
        useState<UniqueIdentifier>();
    const [containerName, setContainerName] = useState('');
    const [itemName, setItemName] = useState('');
    const [showAddContainerModal, setShowAddContainerModal] = React.useState<boolean>(false);
    const [showAddItemModal, setShowAddItemModal] = React.useState<boolean>(false);

    const [isCreating, setIsCreating] = React.useState<boolean>(false);


    const onAddContainer = async () => {
        if (!containerName) return;
        const id = `container-${uuidv4()}`;
        setContainers([
            ...containers,
            {
                id,
                title: containerName,
                items: [],
            },
        ]);

        try {
            setIsCreating(true);
            const boardId = '';
            await addColumn(boardId, containerName);
        } catch (err) {
            console.log('Error in adding column', err)
        } finally {
            setIsCreating(false);
            setContainerName('');
            setShowAddContainerModal(false);
        }
    };

    const onAddItem = async () => {
        if (!itemName) return;
        const id = `item-${uuidv4()}`;
        const container = containers.find((item) => item.id === currentContainerId);
        if (!container) return;
        container.items.push({
            id,
            title: itemName,
        });
        setContainers([...containers]);

        try {
            const boardId = '';
            const columnIndex = 0;

            await addTicket(boardId, columnIndex, itemName);
        } catch (err) {
            console.log('Error in adding ticket', err);
        }

        setItemName('');
        setShowAddItemModal(false);
    };

    // Find the value of the items
    const findValueOfItems = (id: UniqueIdentifier | undefined, type: string) => {
        if (type === 'container') {
            return containers.find((item) => item.id === id);
        }
        if (type === 'item') {
            return containers.find((container) =>
                container.items.find((item) => item.id === id),
            );
        }
    }

    const findItemTitle = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'item');
        if (!container) return '';
        const item = container.items.find((item) => item.id === id);
        if (!item) return '';
        return item.title;
    };

    const findContainerTitle = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'container');
        if (!container) return '';
        return container.title;
    };

    const findContainerItems = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'container');
        if (!container) return [];
        return container.items;
    };

    // DND Handlers
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const { id } = active;
        setActiveId(id);
    }

    const handleDragMove = (event: DragMoveEvent) => {
        const { active, over } = event;

        // Handle Items Sorting
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('item') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active container and over container
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'item');

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;

            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id,
            );

            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id,
            );
            const overitemIndex = overContainer.items.findIndex(
                (item) => item.id === over.id,
            );
            // In the same container
            if (activeContainerIndex === overContainerIndex) {
                let newItems = [...containers];
                newItems[activeContainerIndex].items = arrayMove(
                    newItems[activeContainerIndex].items,
                    activeitemIndex,
                    overitemIndex,
                );

                setContainers(newItems);
            } else {
                // In different containers
                let newItems = [...containers];
                const [removeditem] = newItems[activeContainerIndex].items.splice(
                    activeitemIndex,
                    1,
                );
                newItems[overContainerIndex].items.splice(
                    overitemIndex,
                    0,
                    removeditem,
                );
                setContainers(newItems);
            }
        }

        // Handling Item Drop Into a Container
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('container') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'container');

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;

            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id,
            );

            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id,
            );

            // Remove the active item from the active container and add it to the over container
            let newItems = [...containers];
            const [removeditem] = newItems[activeContainerIndex].items.splice(
                activeitemIndex,
                1,
            );
            newItems[overContainerIndex].items.push(removeditem);
            setContainers(newItems);
        }
    };

    return (
        <div className="w-full h-full mt-10">
            {/*Container Modal */}
            <Modal
                showModal={showAddContainerModal}
                setShowModal={setShowAddContainerModal}
            >
                <div className="flex flex-col w-full items-start gap-y-4">
                    <h1 className="text-gray-800 text-3xl font-bold">Add Container</h1>
                    <Input
                        type="text"
                        placeholder="Container Title"
                        name="containername"
                        value={containerName}
                        onChange={(e) => setContainerName(e.target.value)}
                    />
                    <Button onClick={onAddContainer} disabled={isCreating}>Add container</Button>
                </div>
            </Modal>
            {/*Item Modal */}
            <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
                <div className="flex flex-col w-full items-start gap-y-4">
                    <h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
                    <Input
                        type="text"
                        placeholder="Item Title"
                        name="itemname"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                    />
                    <Button onClick={onAddItem}>Add Item</Button>
                </div>
            </Modal>

            <div className="flex flex-row h-full gap-2 overflow-x-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                >

                    <SortableContext items={containers.map((i) => i.id)}>
                        {containers.map((container) => (
                            <div className="h-full" key={container.id}>
                                <Container
                                    key={container.id}
                                    id={container.id}
                                    title={container.title}
                                    onAddItem={() => {
                                        setShowAddItemModal(true);
                                        setCurrentContainerId(container.id);
                                        console.log(container.id)
                                    }}
                                >
                                    <SortableContext items={container.items.map((i) => i.id)}>
                                        <div className="flex items-start flex-col gap-y-4">
                                            {container.items.map((i) => (
                                                <Items title={i.title} id={i.id} key={i.id} />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </Container>
                            </div>
                        ))}
                    </SortableContext>
                    <Button onClick={() => setShowAddContainerModal(true)} className='rounded-full' size="sm">
                        <Plus className='h-3 w-3' />
                    </Button>

                    <DragOverlay adjustScale={false}>
                        {/* Drag Overlay For item Item */}
                        {activeId && activeId.toString().includes('item') && (
                            <Items id={activeId} title={findItemTitle(activeId)} />
                        )}
                    </DragOverlay>
                </DndContext>
            </div>

        </div>
    )
}
