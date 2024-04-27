
import { getFirestore, getDoc, doc, setDoc, serverTimestamp, runTransaction, deleteDoc, arrayUnion, updateDoc, collection } from 'firebase/firestore'
import { auth } from '../dbConfig/auth'
import { resolve } from 'path';
import { Exo } from 'next/font/google';
export const db = getFirestore();


export const addBoard = (projectId: string, userData: any) => {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(collection(db, "boards"));

        const data = {
            boardName: userData.name,
            columns: [{
                columnName: 'Todo',
                tickets: [],
            },
            {
                columnName: 'Inprogress',
                tickets: [],
            },
            {
                columnName: 'Done',
                tickets: [],
            },],        // will contain users id {columnName: abc, ticketsId: []}
        };
        try {
            await setDoc(docRef, data);

            const projectRef = doc(db, "projects", projectId);
            const project = await getDoc(projectRef);

            if (project.exists()) {
                const currentArray = project.data()?.arrayField || [];
                const updatedArray = arrayUnion(currentArray, docRef.id);

                await updateDoc(docRef, {
                    boards: updatedArray
                });

                resolve({ message: 'success', ...data, boardId: docRef.id });
            } else {
                console.error("Document does not exist.");
                reject({ message: 'Error!' });
            }

        } catch (err) {
            reject(err);
        }
    });
};

export const deleteBoard = (boardId: string, projectId: string) => {
    return new Promise(async (resolve, reject) => {

        try {
            const docRef = doc(db, "boards", boardId);
            const board = await getDoc(docRef);

            if (board.exists()) {
                await deleteDoc(docRef);

                const projectRef = doc(db, "projects", projectId);
                const project = await getDoc(projectRef);

                if (project.exists()) {
                    const currentArray = project.data()?.arrayField || [];
                    const updatedArray = currentArray.filter((currentBoardId: string) => currentBoardId !== boardId);

                    await updateDoc(docRef, {
                        boards: updatedArray
                    });

                    resolve({ message: 'success', boardId: docRef.id });
                } else {
                    // console.error("Document does not exist.");
                    reject({ message: 'Error!' });
                }
            }
        } catch (err) {
            reject(err);
        }
    })
};


export const updateBoard = (boardId: string, boardName: string) => {
    return new Promise(async (resolve, reject) => {

        const docRef = doc(db, "boards", boardId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            await updateDoc(docRef, {
                boardName: boardName,
            });

            console.log("board name updated.");
        } else {
            console.log("board name not updated.");
        }
    });
};


export const addColumn = (boardId: string, columnName: string) => {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(db, "boards");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            try {
                await updateDoc(docRef, {
                    columns: arrayUnion(...[{
                        columnName: columnName,
                        tickets: [],
                    }]),
                });
                resolve({ message: 'success' });
            } catch (err) {
                console.log('Error in adding new column', err);
                reject({ message: 'Error' })
            }
        }
    });
};