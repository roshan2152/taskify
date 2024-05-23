import { db } from '@/dbConfig/dbConfig';
import { BoardType } from '@/types';
import {  getDoc, doc, setDoc,   deleteDoc, arrayUnion, updateDoc, collection } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid';

export const addBoard = (projectId: string, boardName: string) => {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(collection(db, "boards"));

        const data = {
            boardName,
            containers: [{
                id: 'container'+uuidv4(),
                title: 'Todo',
                items: [],
            },
            {
                id: 'container'+uuidv4(),
                title: 'Inprogress',
                items: [],
            },
            {
                id: 'container'+uuidv4(),
                title: 'Done',
                items: [],
            },],        // will contain users id {title: abc, ticketsId: []}
        };
        try {
            await setDoc(docRef, data);

            const projectRef = doc(db, "projects", projectId);
            const project = await getDoc(projectRef);

            if (project.exists()) {
                await updateDoc(projectRef, {
                    boards: arrayUnion(docRef.id),
                });
                resolve({ ...data, id: docRef.id });
            } else {
                reject({ message: 'Error in adding board' });
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

                    resolve({ id: docRef.id });
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

        try {
            const docRef = doc(db, "boards", boardId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                await updateDoc(docRef, {
                    boardName: boardName,
                });

            resolve({message : "board name updated successfully"})
            } 

            reject ({message: "board does not exists"})
        } catch (e) {
            reject({message: "some error occured while changing board name", error: e})
        }
    });
};

export const addColumn = (boardId: string, title: string, columnId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db,'boards',boardId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                await updateDoc(docRef, {
                    containers: arrayUnion({id: columnId, title: title, items: []})
                });

                resolve({message: "column added successfully"})
            }
        } catch (e) {
            reject({message: "error in adding column", error: e})
        }
    });
};

export const getBoard = (boardId: string) => {
    return new Promise(async (resolve, reject) => {

        try {
            const docRef = doc(db, "boards", boardId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                resolve({ id: docRef.id, ...docSnap.data() });
            }

            reject({message:"board does not exists"})

        } catch (err) {
            reject({ message: 'Error in fetching board' });
        }
    });
}

export const getBoards = (boards: string[]) => {
    return new Promise(async (resolve, reject) => {

        try {
            let resArray: BoardType[] = [];

            boards.map(async (boardId: string) => {

                const docRef = doc(db, "boards", boardId);
                const docSnap = await getDoc(docRef);


                if (docSnap.exists()) {
                    // console.log( docSnap.data())
                    resArray.push({
                        id: docRef.id,
                        boardName: docSnap.data().boardName,
                        containers: docSnap.data().containers
                    });

                    const data = docSnap.data();
                    console.log(data);

                    resolve(resArray);
                }
            });

        } catch (err) {
            console.log(err);
            reject({ message: 'Error' });
        }
    });
}