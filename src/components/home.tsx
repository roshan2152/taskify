"use client";

import { ProjectId,Project } from "@/types/projectType";
import { User } from "firebase/auth";
import Navbar from "@/components/navigationBar/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import Board from "./board/board";
import { useState } from "react";

interface HomeProps {
    user: User;
}

export const Home = ({ user }: HomeProps) => {

    const [projects,setProjects] = useState<Project[]>([]);

    return (
        <div className="h-screen dark:bg-[#1d2125]">
            <Navbar />
            <div className="flex flex-row pt-16 h-[100vh] ">
                <div className="hidden md:flex">
                    <Sidebar projects={projects} setProjects={setProjects} />
                </div>
                <Board projects={projects} setProjects={setProjects}/>
            </div>
        </div>
    )
}