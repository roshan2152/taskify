"use client"


import { provider, auth } from "@/dbConfig/auth";
import { User, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Home } from "@/components/home";
import { Login } from "@/components/login";

const Landing = () => {

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const signIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result.user);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
            console.log(currentUser)
        });
        return () => unsubscribe();
    }, [user])

    return (
        <>
            {!user && isLoading && <div>Loading...</div>}
            {!user && !isLoading &&
                <Login user={user} signIn={signIn} />
            }

            {user && <Home user={user}/>}
        </>
    )
}
export default Landing