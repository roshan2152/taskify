'use client'
import React from 'react'
import { ModeToggle } from '../mode-toggle';
import { ListTodo } from 'lucide-react';
import { auth } from '@/dbConfig/auth';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


function navbar() {

    return (
        <div className="flex justify-between items-center text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3 fixed top-0 px-5">
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
                        <img src={auth.currentUser?.photoURL!} alt="profile" className="w-10 h-10 rounded-full" />
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                    
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default navbar