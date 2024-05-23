import { getDoc, doc, setDoc, serverTimestamp, deleteDoc, updateDoc, collection } from 'firebase/firestore'
import { db } from '@/dbConfig/dbConfig';
import { DNDType, itemType } from '@/types';
import { arrayMove } from '@dnd-kit/sortable';

export const addTicket = (boardId: string, containerId: number | string, ticketName: string, ticketId: string) => {
    return new Promise(async (resolve, reject) => {

        const data = {
            ticketName,
            description: '',
            comments: '',
            assignee: null,
            reporter: null,
            createdAt: serverTimestamp(),
        };


        try {
            const docRef = doc(db, 'tickets', ticketId);
            await setDoc(docRef, data);

            const boardRef = doc(db, "boards", boardId);
            const docSnap = await getDoc(boardRef);

            if (docSnap.exists()) {
                const containers = docSnap.data().containers;
                console.log(containers)

                const newContainers = containers.map((container: any) => {
                    if (container.id === containerId) {
                        container.items.unshift({
                            id: ticketId,
                            title: ticketName
                        })
                    }
                    return container;
                })

                updateDoc(boardRef, {
                    containers: newContainers,
                });
                resolve({ id: docRef.id, title: ticketName });
            }

            reject({ message: "board does not exist in which you want to create a ticket/item" })

        } catch (e) {
            reject({ message: "something went wrong while creating ticket", error: e });
        }
    });
};

export const deleteTicket = (ticketId: string, boardId: string, columnIndex: number) => {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(db, "tickets", ticketId);
        const docSnap = await getDoc(docRef);

        try {

            if (docSnap.exists()) {
                await deleteDoc(docRef);

                const boardRef = doc(db, "boards", boardId);
                const board = await getDoc(docRef);

                if (board.exists()) {
                    await deleteDoc(docRef);

                    // const currentArray = board.data()?.arrayField || [];
                    const currentTickets = docSnap.data()?.columns[columnIndex].tickets.arrayField || [];
                    const updatedTickets = currentTickets.filter((currentTicketId: string) => currentTicketId !== ticketId);

                    await updateDoc(docRef, {
                        [`columns[${columnIndex}].tickets`]: updatedTickets,
                    });

                    resolve({ message: 'success', boardId: docRef.id });
                }
                else {
                    // console.error("Document does not exist.");
                    reject({ message: 'Error!' });
                }
                resolve({ message: 'success' });
            }
        } catch (err) {
            reject(err);
        }
    });
};


export const updateTicket = (ticketId: string, boardId: string, columnIndex: number, ticketData: any) => {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(db, "tickets", ticketId);
        const docSnap = await getDoc(docRef);

        try {

            if (docSnap.exists()) {
                await updateDoc(docRef, {
                    ticketName: ticketData.name,
                    description: ticketData.description,
                    comments: '',
                    assignee: ticketData.assignee,
                    reporter: ticketData.reporter,
                    updatedAt: serverTimestamp(),
                });

                resolve({ message: 'success' });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

export const moveTicketToDifferentContainer = (ticket: itemType, boardId: string, newcolumnIndex: number, overitemIndex: number) => {
    return new Promise(async (resolve, reject) => {

        const docRef = doc(db, "boards", boardId);
        const docSnap = await getDoc(docRef);

        try {
            if (docSnap.exists()) {
                let containers = docSnap.data().containers;

                containers = containers.map((container: any) => ({
                    ...container,
                    items: container.items.filter((item: itemType) => item.id as string !== ticket.id)
                }));
                containers[newcolumnIndex].items.splice(overitemIndex, 0, ticket);

                await updateDoc(docRef, {
                    containers: containers
                });

                resolve({message:'success'})
            }

            reject({ message: 'error in moving ticket to different container' });

        } catch (e) {
            reject({message:"error in moving ticket to differenct container",error:e})
        }
    });
};

export const moveTicketInSameContainer = (boardId: string,activeContainerIndex: number,activeItemIndex: number,overItemIndex: number)=>{
    return new Promise(async (reject,resolve) => {
        try {
            const boardRef = doc(db,'boards',boardId);
            const boardSnapshot = await getDoc(boardRef);

            if(boardSnapshot.exists()){
                let containers = boardSnapshot.data().containers;
                containers[activeContainerIndex] = arrayMove(
                    containers[activeContainerIndex],
                    activeItemIndex,
                    overItemIndex,
                )

                await updateDoc(boardRef,{
                    containers: containers
                })

                resolve({message:"success"})
            }
            reject({message:"something went wrong while moving ticket to same container"});
        } catch (e) {
            reject({message:"something went wrong while moving ticket to same container",error:e})
        }
    })
}
export const moveTicketToEmptyContainer = (ticket: itemType, boardId: string, newColumnIndex:number) => {
    return new Promise(async (resolve,reject) => {
        try {
            const boardRef = doc(db,'boards',boardId);
            const boardSnapshot = await getDoc(boardRef);

            if(boardSnapshot.exists()){
                let containers = boardSnapshot.data().containers;
                containers = containers.map((container: DNDType) => ({
                    ...container,
                    items: container.items.filter((item:itemType) => item.id !== ticket.id)
                }))
                containers[newColumnIndex].items.push(ticket);
                await updateDoc(boardRef, {
                    containers: containers
                });
                resolve({message:"ticket moved to an empty container"})
            }
        } catch (e) {
            reject({message:"error in moving ticket to an empty container",error:e})
        }
    })
}
export const getTicket = (id: string) => {
    return new Promise(async (resolve, reject) => {

        try {
            const docRef = doc(db, "tickets", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                resolve({ id: docRef.id, ...docSnap.data() });
            }

        } catch (err) {
            console.log(err);
            reject({ message: 'Error in fetching ticket' });
        }
    });
}