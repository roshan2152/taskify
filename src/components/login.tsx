"use client"

import { Button } from "@/components/ui/button";
import { auth, provider } from "@/dbConfig/auth";
import { User, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/backend/user";
import { UserType } from "@/types/userType";

export const Login = () => {

    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    const signIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            await loginUser();

            //router.push('/')
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
        <div className="flex items-center justify-center h-[100vh]">
            {isLoading && <p>Loading...</p>}
            {user && <p>Welcome {user.displayName}</p>}

            {!isLoading && !user && <Button
                size="lg"
                variant="default"
                onClick={signIn}
            >
                <LogIn className="w-4 h-4 mr-2" />
                Login
            </Button>}
        </div>
    )
}