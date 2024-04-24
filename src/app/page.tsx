"use client"

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import {provider,auth} from "@/dbConfig/auth";
import { User, signInWithPopup,onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Home } from "@/components/home";

const Login = () => {

    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

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
            console.log(user)
        });
        return () => unsubscribe();
    },[user])

    return (
        <div className="flex items-center justify-center border-2 h-[100vh]">
        { !user && <Button
            size="lg"
            variant="default"
            onClick={signIn}
        >
            <LogIn className="w-4 h-4 mr-2"/>
            Login
        </Button>}
        {
            user && <Home user={user}/>
        }
        </div>
    )
}
export default Login