'use client';
import React, { useEffect, useState } from 'react'
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
import { addTicket, getTicket, moveTicketToDifferentContainer,moveTicketToEmptyContainer,moveTicketInSameContainer} from '@/backend/tickets';
import { Plus } from 'lucide-react';
import { BoardType, DNDType, TicketType } from '@/types';


interface MainBoardProps {
    board: BoardType | null;
}

export default function MainBoard({ board }: MainBoardProps) {

    const [containers, setContainers] = useState<DNDType[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();
    const [containerName, setContainerName] = useState('');
    const [itemName, setItemName] = useState('');
    const [showAddContainerModal, setShowAddContainerModal] = useState<boolean>(false);
    const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [allTickets, setAllTickets] = useState<TicketType[]>([]);


    const getData = () => {
        if (board) {
            setContainers(board.containers)
        }
    };

    const getAllTickets = async () => {

        if (containers.length > 0) {
            const tickets = [] as UniqueIdentifier[];

            containers.forEach((container) => {
                if (container.items) {
                    container.items.forEach((item) => tickets.push(item.id))
                }
            });

            if (tickets.length > 0) {
                console.log(tickets)

                const promiseArray = tickets.map(async (id) => await getTicket(id as string));
                const res = await Promise.all(promiseArray) as TicketType[];
                setAllTickets(res);
            }
        }
    };

    useEffect(() => {
        getData();
    }, [board]);

    useEffect(() => {
        getAllTickets();
    }, []);

    const onAddContainer = async () => {
        if (!containerName) return;

        try {
            if (board) {
                setIsCreating(true);

                const columnId = 'container'+uuidv4();
                await addColumn(board.id, containerName, columnId);

                setContainers([
                    ...containers,
                    {
                        id: columnId,
                        title: containerName,
                        items: [],
                    },
                ]);
            }
        } catch (err) {
            console.log('Error in adding container', err)
        } finally {
            setIsCreating(false);
            setContainerName('');
            setShowAddContainerModal(false);
        }
    };

    const onAddItem = async () => {
        if (!itemName)
            return;

        try {
            if (board) {
                setIsCreating(true);
                const ticketId = 'item' + uuidv4();
                const res = await addTicket(board.id, currentContainerId!, itemName, ticketId) as { id: UniqueIdentifier, title: string };
                const newContainers = containers.map((container) => {
                    if (container.id == currentContainerId)
                        container.items.unshift(res)
                    return container;
                })
                setContainers(newContainers);
                getAllTickets();
            }
        } catch (err) {
            console.log("error in adding ticket/item", err);
        } finally {
            setIsCreating(false);
            setItemName('');
            setShowAddItemModal(false);
        }
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
    };

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
        setActiveId(id as string);
    };

    const handleDragMove = async (event: DragMoveEvent) => {
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
            const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
            const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);
            const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id);

            // In the same container
            if (activeContainerIndex === overContainerIndex) {
                let newItems = [...containers];
                newItems[activeContainerIndex].items = arrayMove(
                    newItems[activeContainerIndex].items,
                    activeitemIndex,
                    overitemIndex,
                );
                setContainers(newItems);

                try {
                    await moveTicketInSameContainer(board?.id!, activeContainerIndex, activeitemIndex, overitemIndex)
                } catch (e) {
                    console.log('error in moving ticket in same container',e);
                }
            } else {
                // In different containers
                let newItems = [...containers];
                const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1);
                newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem);
                setContainers(newItems);
           
                try {
                    await moveTicketToDifferentContainer(removeditem, board?.id!, overContainerIndex, overitemIndex);
                } catch (err) {
                    console.log('Error in moving tickets', err); 
                }
            }
        }

        // Handling Item Drop Into a Container
        if (
            active?.id.toString().includes('item') &&
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
            const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
            const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);

            // Remove the active item from the active container and add it to the over container
            let newItems = [...containers];
            const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1);
            newItems[overContainerIndex].items.push(removeditem);
            setContainers(newItems);

            try {
                await moveTicketToEmptyContainer(removeditem, board?.id!, overContainerIndex);
            } catch (err) {
                console.log('Error in moving tickets to empty container', err);
            }
        }
    }


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
                    <Button onClick={onAddContainer}> Add container </Button>
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

                    <SortableContext items={containers && containers.map((i) => i.id)}>
                        {containers && containers.map((container) => (
                            <div className="h-full" key={container.id}>
                                <Container
                                    key={container.id}
                                    id={container.id}
                                    title={container.title}
                                    onAddItem={() => {
                                        setShowAddItemModal(true);
                                        setCurrentContainerId(container.id);
                                    }}
                                >
                                    <SortableContext items={container.items.map((item) => item.id)}>
                                        <div className="flex items-start flex-col gap-y-4" onClick={() => console.log(4324)}>
                                            {
                                                container.items.map((ticket) => (
                                                    <Items id={ticket.id} title={ticket.title} key={ticket.id} />
                                                ))
                                            }
                                        </div>
                                    </SortableContext>
                                </Container>
                            </div>
                        ))}
                    </SortableContext>
                    <Button onClick={() => setShowAddContainerModal(true)} className='rounded-full' size="sm">
                        <Plus className='h-3 w-3' />
                    </Button>

                    <DragOverlay adjustScale={true}>
                        {/* Drag Overlay For item Item */}
                        {activeId && activeId.toString().includes('item') && (
                            <Items id={activeId} title={findItemTitle(activeId)} isOverlay={true}/>
                        )}
                    </DragOverlay>
                </DndContext>
            </div>

        </div>
    )
}

