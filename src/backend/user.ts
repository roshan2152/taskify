
import { getDoc, doc, setDoc, serverTimestamp, runTransaction } from 'firebase/firestore'
import { auth } from '../dbConfig/auth'
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '@/dbConfig/dbConfig';

export const loginUser = async () => {
    return new Promise(async (resolve, reject) => {

        if (auth.currentUser) {
            try {
                const docRef = doc(db, "user", auth.currentUser.uid);
                const userData = await getDoc(docRef);

                if (userData.exists()) {
                    resolve({ uid: auth.currentUser.uid, ...userData.data() });
                } else {
                    const data = {
                        uid: auth.currentUser.uid,
                        email: auth.currentUser.email,
                        name: auth.currentUser.displayName,
                    };
                    await setDoc(docRef, data);
                    resolve(data);
                }
            } catch (err) {
                console.log('Error in loginUser', err);
            }
        }
    });
};

export const getUser = async () => {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "user", user.uid);
                    const userData = await getDoc(docRef);

                    if (userData.exists()) {
                        resolve(userData.data());
                    } else {
                        reject({ message: 'User does not exists' });
                    }

                } catch (err) {
                    console.log('Error in getUser', err);
                }
            }
        });
    });
};