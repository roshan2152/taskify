"use client"

import { createContext,useContext,useState,useEffect } from "react";
import { auth } from "@/dbConfig/auth";
import { User, onAuthStateChanged} from "firebase/auth";

interface AuthContextProps {
    user: User|null,
    isLoading: boolean
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}:any) => {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [user])

    return (
        <AuthContext.Provider value={{user,isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}