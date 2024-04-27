"use client";

import { ProjectType } from "@/types/projectType";
import Navbar from "@/components/navigationBar/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import Board from "./board/board";
import { useEffect, useState } from "react";
import { getProject, } from "@/backend/projects";
import { UserType } from "@/types/userType";

interface HomeProps {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

export const Home = ({ user, setUser }: HomeProps) => {

    const [projects, setProjects] = useState<ProjectType[]>([]);

    const getProjects = async () => {
        if (user && user.projects.length > 0) {
            const projectPromises = user.projects.map(async (projectId: string) => {
                return await getProject(projectId);
            });

            const projectResults = await Promise.all(projectPromises) as ProjectType[];
            setProjects(projectResults);
        }
    };

    useEffect(() => {
        getProjects();
        // eslint-disable-next-line
    }, []);
    
    console.log(projects);
    
    return (
        <div className="h-screen dark:bg-[#1d2125]">
            <Navbar setUser={setUser} />
            <div className="flex flex-row pt-16 h-[100vh] ">
                <div className="hidden md:flex">
                    <Sidebar projects={projects} setProjects={setProjects} />
                </div>
                <Board projects={projects} setProjects={setProjects} />
            </div>
        </div>
    )
};
