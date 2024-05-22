import {  getDoc, doc, setDoc, serverTimestamp,  collection } from 'firebase/firestore'
import { db } from '@/dbConfig/dbConfig';



export const addComment = (userId: string, ticketId: string, commentData:any) => {
    return new Promise(async (resolve, reject) => {

        const docRef = doc(collection(db, "comments"));

        const data = {
            description: commentData.description,
            createdAt: serverTimestamp(),
        };

        try {
            await setDoc(docRef, data);
            resolve({ ...data, commentId: docRef.id });
        } catch (err) {
            reject(err);
        }
    });
};

export const deleteTicket = () => {

};


export const updateTicket = () => {

}