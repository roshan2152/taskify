import Board from '@/components/board/boards';
import { BoardType } from '@/types/boardType';
import { getFirestore, getDoc, doc, setDoc, serverTimestamp, runTransaction, deleteDoc, arrayUnion, updateDoc, collection } from 'firebase/firestore'
export const db = getFirestore();

export const addBoard = (projectId: string, boardName: string) => {
    return new Promise(async (resolve, reject) => {
        const docRef = doc(collection(db, "boards"));

        const data = {
            boardName,
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
                await updateDoc(docRef, {
                    boards: arrayUnion(docRef.id),
                });

                resolve({ message: 'success', ...data, id: docRef.id });
            } else {
                console.error("Document does not exist.");
                reject({ message: 'Error!' });
            }

        } catch (err) {
            console.log(err);
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

                    resolve({ message: 'success', id: docRef.id });
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
                reject({ message: 'Error' });
            }
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

        } catch (err) {
            console.log(err);
            reject({ message: 'Error' });
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
                        columns: docSnap.data().columns
                    });

                    const data = docSnap.data();
                    console.log(data);

                    resolve(resArray);
                }
            });
            resolve(resArray);


        } catch (err) {
            console.log(err);
            reject({ message: 'Error' });
        }
    });
}