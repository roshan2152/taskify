import { getFirestore, getDoc, doc, setDoc, serverTimestamp, updateDoc, arrayUnion, collection, } from 'firebase/firestore'
export const db = getFirestore();

export const createProject = (name: string, userId: string | undefined) => {
    return new Promise(async (resolve, reject) => {

        const docRef = doc(collection(db, "projects"));
        console.log(userId)
        const data = {
            projectName: name,
            members: [],        // will contain users id {email: abc@gmail.com, permission: 0}
            boards: [],
        };

        try {
            await setDoc(docRef, data);

            if (userId !== undefined) {
                const userDocRef = doc(db, "user", userId);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    await updateDoc(userDocRef, {
                        projects: arrayUnion(docRef.id),
                    });

                    console.log("project id added to array successfully.");
                    resolve({ ...data, id: docRef.id });
                } else {
                    console.error("Error in creating project.");
                    reject({ message: 'Error!' });
                }
            }

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
                resolve({ id: docRef.id, ...docSnap.data() });
            }

        } catch (err) {
            console.log(err);
            reject({ message: 'Error' });
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