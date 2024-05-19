"use client"

import { useAuth } from "@/context/authContext";


const HomePage = () => {

    const {user,isLoading} = useAuth();

    return (
        <div className="p-14 w-full h-full border flex flex-col items-center justify-center">
            {isLoading && <p>Loading...</p>}
            {!isLoading && user && <p>Welcome {user.displayName}</p>}
        </div>
    );
}

export default HomePage