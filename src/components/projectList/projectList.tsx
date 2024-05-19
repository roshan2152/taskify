"use client"
import { ProjectType } from "@/types/projectType"
import { ChevronRight, ChevronDown, PanelsTopLeft } from "lucide-react"
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { MouseEvent } from 'react'; // Assuming you are using React

interface ProjectListProps {
    projects: ProjectType[],
}

export const ProjectList = ({ projects }: ProjectListProps) => {

    const [expanded, setExpanded] = useState<boolean>(true);
    const handleExpand = () => setExpanded(!expanded);
    const router = useRouter();

    // console.log(projects);

    const showProject = (e:any, id: string) => {
        // console.log(id)
        e.preventDefault();
        router.push(id);
    };


    return (
        <>
            <div role="button" onClick={handleExpand} className="flex flex-row gap-4 text-[#44556f] rounded-md hover:bg-[#e9f2ff] dark:text-white dark:hover:bg-gray-700 text-sm p-3 w-full items-center">
                {expanded ? <ChevronDown size={20} strokeWidth={2.5} /> : <ChevronRight size={20} strokeWidth={2.5} />}
                Your Projects
            </div>
            {
                expanded && (projects.length == 0 ? (<p className="pl-[35px] m-2 text-sm text-slate-500">No Projects found</p>)
                    : (
                        projects.map((project) => (
                            <div key={project.id} onClick={(e) => showProject(e, project.id)} className="flex items-center justify-center mt-2 ml-[30px] pl-2 rounded text-sm text-slate-500 font-bold bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-900 overflow-hidden" role="button">
                                <PanelsTopLeft className="h-3 w-3" />
                                <p className="p-1 overflow-hidden w-full text-nowrap truncate">
                                    {project.projectName}
                                </p>
                            </div>)
                        )
                    )
                )
            }
        </>
    )
}