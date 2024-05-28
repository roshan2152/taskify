import { db } from '@/dbConfig/dbConfig';
import { getDoc, doc, setDoc, serverTimestamp, updateDoc, arrayUnion, collection, query, where, getDocs, } from 'firebase/firestore'
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
                membersEmail : [auth.currentUser?.email],
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

// export const addMember = (projectId: any, memberData: any) => {
//     return new Promise(async (resolve, request) => {

//         const docRef = doc(db, "projects", projectId);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {

//             try {
//                 await updateDoc(docRef, {
//                     members: [] // userId
//                 });

//             } catch (err) {
//                 console.log(err)
//             }

//             console.log("project id added to array successfully.");
//         } else {
//             console.error("Document does not exist.");
//         }

//     });
// };

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
}

// const fs = require('fs');
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.API_KEY);

// export const sendEmail = async () => {

//     const message = {
//         to: 'taskify@gmail.com',
//         from: 'yourtaskify@gmail.com',
//         subject: 'Hello from taskify',
//         text: 'hello hello',
//         html: '<h1>hello hello</h1>',
//     };

//     try {
//         await sgMail.send(message);
//         console.log('Email sent...')
//     } catch (err) {
//         console.log('Email not sent...', err)
//     }
// }

export const sendEmail = async (email: string) => {


    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey('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')
    const msg = {
        to: email, // Change to your recipient
        from: 'taskify@gmail.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    try {
        await sgMail.send(msg);
        console.log('Email sent')

    } catch (err) {
        console.error(err)
    }
};