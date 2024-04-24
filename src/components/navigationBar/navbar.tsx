'use client'
import React from 'react'
import { LogOut } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';
import { ListTodo } from 'lucide-react';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { signOut } from 'firebase/auth';
import { auth } from '@/dbConfig/auth';
import { Button } from '../ui/button';
import Image from 'next/image';

function navbar() {

    return (
        <div className="flex justify-between items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3 px-5">
            <div className="flex items-center gap-3">
                <ListTodo color="#0c45ed" strokeWidth={2.75} />
                <div>
                    TASKIFY
                </div>
            </div>
            <Popover>
                <PopoverTrigger>
                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <img 
                            src={auth.currentUser?.photoURL!} alt="profile" className="w-10 h-10 rounded-full"
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                    <div className='flex items-center justify-center'>
                        <Button
                            onClick={() => signOut(auth)}
                            size="sm"
                            variant="destructive"
                            className='w-full'
                        >
                            <LogOut className='w-4 h-4 mr-2'/>
                            Sign Out
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

        </div>
    )
}

export default navbar