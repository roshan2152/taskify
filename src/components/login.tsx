"use client"

import { Button } from "@/components/ui/button";
import { auth, provider } from "@/dbConfig/auth";
import { signInWithPopup } from "firebase/auth";
import { LogIn } from "lucide-react";

import { useRouter } from "next/navigation";
import { loginUser } from "@/backend/user";
import { useAuth } from "@/context/authContext";


export const Login = () => {

    const {user,isLoading} = useAuth();
    const router = useRouter();

    const signIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            await loginUser();

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center h-[100vh] border">
            {isLoading && <p>Loading...</p>}
            {user && <Button onClick={() => router.push('/home')}>Enter Taskify</Button>}

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