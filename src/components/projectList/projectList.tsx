"use client"
import { Project } from "@/types/projectType"
import { ChevronRight,ChevronDown, PanelsTopLeft } from "lucide-react"
import { useState } from "react";

interface ProjectListProps {
    projects : Project[],
}

export const ProjectList = ({projects}: ProjectListProps) => {

    const [expanded,setExpanded] = useState<boolean>(false);
    const handleExpand = () => {
        setExpanded(!expanded);
    }

    return (
       <>
            <div role="button" onClick={handleExpand} className="flex flex-row gap-4 text-[#44556f] rounded-md hover:bg-[#e9f2ff] dark:text-white dark:hover:bg-gray-700 text-sm p-3 w-full items-center">
                {expanded ? <ChevronDown size={20} strokeWidth={2.5} /> : <ChevronRight size={20} strokeWidth={2.5}/>}
                Your Projects
            </div>
            {expanded && (projects.length==0 ? (<p className="pl-[35px] m-2 text-sm text-slate-500">No Projects found</p>):(
                projects.map((project) => <div>
                    <div className="flex flex-row gap-2 items-center pl-[25px] m-2" role="button">
                        <p className="flex flex-start  text-sm font-bold text-slate-500 bg-slate-200 p-2 overflow-hidden w-full text-center rounded-md hover:text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white"><PanelsTopLeft className="h-4 w-4 mr-2"/>{project.name}</p>
                    </div>
                </div>)
            ))}
       </>
    )
}