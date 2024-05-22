import { db } from '@/dbConfig/dbConfig';
import { getDoc, doc, setDoc, serverTimestamp, updateDoc, arrayUnion, collection, query, where, getDocs, } from 'firebase/firestore'
import { addBoard } from './boards';


export const createProject = (name: string, userId: string | undefined) => {
    return new Promise(async (resolve, reject) => {

        try {
            const docRef = doc(collection(db, "projects"));
            const data = {
                projectName: name,
                members: [],        // will contain users id {email: abc@gmail.com, permission: 0}
                boards: [],
                userId: userId
            };
            await setDoc(docRef, data);
            await addBoard(docRef.id,"Board1");
            resolve({id:docRef.id,...data})
        } catch (err) {
            reject(err);
        }
    });
};


export const getProject = (projectId: string) => {
    return new Promise(async (resolve, reject) => {

        try {
            const docRef = doc(db, "projects", projectId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                resolve(docSnap.data());
            }

            reject({ message: 'Error - project does not exists' });

        } catch (err) {
           reject({message:"something went wrong while getting project"})
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

export const getProjectsByUserId = (userId : string | undefined) => {
    return new Promise(async (resolve,reject) => {
        try {
            const projectRef = collection(db, "projects"); // get the reference of the collection
            const q = query(projectRef, where("userId","==",userId));

            const querySnapshot = await getDocs(q);

            const projects = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

           resolve(projects);
        } catch (e) {
            reject({message : e});
        }
})}