import { db } from '@/dbConfig/dbConfig';
import { getDoc, doc, setDoc, deleteDoc, serverTimestamp, updateDoc, arrayUnion, collection, query, where, getDocs, } from 'firebase/firestore'
import { addBoard } from './boards';
import { getAuth } from 'firebase/auth';
import { headers } from 'next/headers';
import { MemberType } from '@/types';


export const createProject = (name: string, userId: string | undefined) => {
    return new Promise(async (resolve, reject) => {

        try {
            const auth = getAuth();
            console.log(auth)
            const docRef = doc(collection(db, "projects"));
            const data = {
                projectName: name,
                members: [{
                    email: auth.currentUser?.email,
                    name: auth.currentUser?.displayName,
                    role: 'admin',
                }],        // will contain users id {email: abc@gmail.com, permission: 0}
                membersEmail: [auth.currentUser?.email],
                boards: [],
                userId: userId
            };
            await setDoc(docRef, data);
            await addBoard(docRef.id, "Board1");
            resolve({ id: docRef.id, ...data })
        } catch (err) {
            reject(err);
        }
    });
};

export const deleteProject = (projectId: string) => {
    return new Promise(async (resolve, reject) => {

        try {
            const docRef = doc(db, "projects", projectId);
            await deleteDoc(docRef);
            
            resolve({ message: 'project deleted successfully.' });
        } catch (err) {
            reject({ message: "something went wrong while deleting project" });
        }
    });
}

export const getProject = (projectId: string) => {
    return new Promise(async (resolve, reject) => {

        try {
            const docRef = doc(db, "projects", projectId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                resolve({ ...docSnap.data(), id: docRef.id });
            }

            reject({ message: 'Error - project does not exists' });

        } catch (err) {
            reject({ message: "something went wrong while getting project" })
        }
    });
};

export const updateProject = (projectId: any, data: MemberType) => {
    return new Promise(async (resolve, reject) => {

        try {
            const docRef = doc(db, "projects", projectId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {

                await updateDoc(docRef, {
                    members: arrayUnion(data),
                    membersEmail: arrayUnion(data.email)
                });

                console.log("project updated successfully.");
                resolve({ message: 'project updated successfully.' });
            } else {
                console.error("Document does not exist.");
            }
        } catch (err) {

            console.log('Error: ', err);
            reject({ message: "something went wrong while updating project" });
        }
    });
};

export const getProjectsByEmail = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const auth = getAuth();
            const projectRef = collection(db, "projects"); // get the reference of the collection

            const q = query(projectRef, where("membersEmail", "array-contains", auth.currentUser?.email));
            const querySnapshot = await getDocs(q);

            const projects = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            resolve(projects);
        } catch (e) {
            reject({ message: e });
        }
    })
};