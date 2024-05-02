
import { getFirestore, getDoc, doc, setDoc, serverTimestamp, updateDoc, arrayUnion, collection, } from 'firebase/firestore'
import { auth } from '../dbConfig/auth'
export const db = getFirestore();

export const createProject = (userData: any, userId: any) => {
    return new Promise(async (resolve, reject) => {

        const docRef = doc(collection(db, "projects"));

        const data = {
            projectName: userData.name,
            members: [],        // will contain users id {email: abc@gmail.com, permission: 0}
            boardsId: [],
        };

        try {

            await setDoc(docRef, data);

            const userDocRef = doc(db, "user", userId);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const currentArray = docSnap.data()?.arrayField || [];
                const updatedArray = arrayUnion(currentArray, docRef.id);

                await updateDoc(docRef, {
                    projects: updatedArray
                });

                console.log("project id added to array successfully.");
                resolve({ ...data, projectId: docRef.id });
            } else {
                console.error("Document does not exist.");
                reject({ message: 'Error!' });
            }
        } catch (err) {
            reject(err);
        }
    });
};


export const updateProject = (projectId: any, data: any) => {
    return new Promise(async (resolve, request) => {

        const docRef = doc(db, "projects", projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            await updateDoc(docRef, {
                name: data.name,
            });

            console.log("project id added to array successfully.");
        } else {
            console.error("Document does not exist.");
        }

    });
};


export const addMember = (projectId: any, memberData: any) => {
    return new Promise(async (resolve, request) => {

        const docRef = doc(db, "projects", projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            try {
                await updateDoc(docRef, {
                    members: [] // userId
                });

            } catch (err) {
                console.log(err)
            }

            console.log("project id added to array successfully.");
        } else {
            console.error("Document does not exist.");
        }

    });
};

export const getProjects = (userId: any) => {
    return new Promise(async (resolve, reject) => {

        const userDocRef = doc(db, "user", userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const projects = docSnap.data()?.projects || [];
            resolve(projects);
        } else {
            console.error("Document does not exist.");
            reject({ message: 'Error!' });
        }
    });
}