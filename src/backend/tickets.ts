import { getFirestore, getDoc, doc, setDoc, serverTimestamp, deleteDoc, updateDoc, arrayUnion, collection } from 'firebase/firestore'
import { auth } from '../dbConfig/auth'
export const db = getFirestore();


export const addTicket = (boardId: string, columnIndex: number, ticketName: string) => {
    return new Promise(async (resolve, reject) => {

        const docRef = doc(collection(db, "tickets"));

        const data = {
            ticketName,
            description: '',
            comments: '',
            assignee: null,
            reporter: null,
            createdAt: serverTimestamp(),
        };

        try {
            await setDoc(docRef, data);

            const boardRef = doc(db, "boards", boardId);
            const docSnap = await getDoc(boardRef);

            if (docSnap.exists()) {
                const currentTickets = docSnap.data()?.columns[columnIndex].tickets.arrayField || [];
                const updateTickets = arrayUnion(currentTickets, docRef.id);

                updateDoc(boardRef, {
                    [`columns[${columnIndex}].tickets`]: updateTickets,
                });
                console.log('ticket added successfully')
                resolve({ ...data, ticketId: docRef.id });
            }

        } catch (err) {
            reject(err);
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