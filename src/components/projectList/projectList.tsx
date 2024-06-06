"use client"
import { ChevronRight, ChevronDown, PanelsTopLeft } from "lucide-react"
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { ProjectType } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/backend/projects";
import { toast } from "react-toastify";

interface ProjectListProps {
    projects: ProjectType[],
}

export const ProjectList = ({ projects }: ProjectListProps) => {

    const [expanded, setExpanded] = useState<boolean>(true);
    const handleExpand = () => setExpanded(!expanded);
    const router = useRouter();

    const showProject = (id: string) => {
        router.push(`/${id}`);
    };

    const handleDeleteProject = async (id: string) =>{
        try{
            await deleteProject(id);
            toast.success('Project deleted successfully');
        }
        catch(err){
            console.log(err);
        }
    }


    return (
        <>
            <div role="button" onClick={handleExpand} className="flex flex-row gap-4 text-[#44556f] rounded-md hover:bg-[#e9f2ff] dark:text-white dark:hover:bg-gray-700 text-sm p-3 w-full items-center transition-colors overflow-auto">
                <div className={`transform transition-transform duration-500 ${expanded ? 'rotate-90' : ''}`}>
                    <ChevronRight size={20} strokeWidth={2.5} />
                </div>
                Your Projects
            </div>
            <div
                className={`transition-max-height duration-500 ease-in-out overflow-hidden ${expanded ? "max-h-screen" : "max-h-0"
                    }`}
            >
                {projects.length === 0 ? (
                    <p className="pl-[35px] m-2 text-sm text-slate-500">
                        No Projects found
                    </p>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => showProject(project.id)}
                            className="flex items-center justify-center mt-2 ml-[30px] pl-2 rounded text-sm text-slate-500 font-bold bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-900 transition-colors"
                            role="button"
                        >
                            <PanelsTopLeft strokeWidth={4} className="h-4 w-4" />
                            <p className="p-1 overflow-hidden w-full text-nowrap truncate">
                                {project.projectName}
                            </p>
                            <Button onClick={() => handleDeleteProject(project.id)} className='bg-transparent hover:bg-slate-300'>
                                <Trash2 color='#64748B' strokeWidth={2} size={15} />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </>
    )
}