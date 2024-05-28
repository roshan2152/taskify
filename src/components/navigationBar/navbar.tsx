"use client"

import { LogOut } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';
import { ListTodo } from 'lucide-react';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { signOut,signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/dbConfig/auth';
import { Button } from '../ui/button';
import {useRouter} from 'next/navigation'
import { useAuth } from '@/context/authContext';


function Navbar() {

    const  router = useRouter();
    const {user,isLoading} = useAuth();

    const signIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result.user);
            // router.push("/main");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignOut = () => {
        signOut(auth)
        router.push('/')
    }

    return (
        <div className="flex justify-between items-center text-primary w-full dark:bg-slate-700 border-b-2 border-[#dddfe5] dark:border-[#282e34] bg-[#E3E5E8] py-2 px-5 fixed top-0 shadow-md">
            <div className="flex items-center gap-3">
                <ListTodo color="#0c45ed" strokeWidth={2.75} />
                <div>
                    TASKIFY
                </div>
            </div>
            
            <div className='flex items-center space-x-6'>
                <ModeToggle />
               {user && !isLoading && <Popover>
                    <PopoverTrigger>
                        <div className="flex items-center gap-3">
                            <img 
                                src={auth.currentUser?.photoURL!} alt="profile" className="w-10 h-10 rounded-full"
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className='flex items-center justify-center'>
                            <Button
                                onClick={handleSignOut}
                                size="sm"
                                variant="destructive"
                                className='w-full'
                            >
                                <LogOut className='w-4 h-4 mr-2'/>
                                Sign Out
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>}
                {!user && isLoading && <div>Loading...</div>}
                {!user && !isLoading && 
                    <Button size="sm" onClick={signIn} variant="default" >
                        Login
                    </Button>
                }
            </div>
        </div>
    )
};

export default Navbar