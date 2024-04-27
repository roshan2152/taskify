"use client"


import { provider, auth } from "@/dbConfig/auth";
import { User, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Home } from "@/components/home";
import { Login } from "@/components/login";
import { getUser, loginUser } from "@/backend/user";
import { UserType } from "@/types/userType";

const Landing = () => {

    const [user, setUser] = useState<UserType |  null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const signIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            const res = await loginUser() as UserType;
            setUser(res);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getUserData = async () => {
        try {
            const res = await getUser() as UserType | null;
            setUser(res);
        } catch (err) {
            console.log('User does not exists', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user === null) {
                setUser(user);
                setIsLoading(false);
            }
            console.log(user);
        });
        getUserData();
        return () => unsubscribe();
    }, []);

    // useEffect(() => {
    //     getUserData(); 
    // },[]);

    // console.log(user)
    return (
        <>
            {
                !user && isLoading && <div>Loading...</div>
            }
            {
                !user && !isLoading &&
                <Login user={user} signIn={signIn} />
            }
            {
                user && <Home user={user} setUser={setUser} />
            }
        </>
    );
};
export default Landing