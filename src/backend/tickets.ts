import {getDoc, doc, setDoc, serverTimestamp, deleteDoc, updateDoc, collection } from 'firebase/firestore'
import { db } from '@/dbConfig/dbConfig';
import { DNDType } from '@/types';



export const addTicket = (boardId: string, containerId: number | string, ticketName: string, ticketId: string
) => {
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
            const docRef = doc(db,'tickets',ticketId);
            await setDoc(docRef, data);
            
            const boardRef = doc(db, "boards", boardId);
            const docSnap = await getDoc(boardRef);

            if (docSnap.exists()) {
                const containers = docSnap.data().containers;
                
                const newContainers = containers.map((container:DNDType) => {
                    if(container.id == containerId){
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
                resolve({ id:docRef.id,title:ticketName });
            }

            reject ({message: "board does not exist in which you want to create a ticket/item"})

        } catch (e) {
            reject({message:"something went wrong while creating ticket", error: e});
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
}