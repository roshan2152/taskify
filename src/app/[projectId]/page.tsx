'use client'
import { getProject } from '@/backend/projects'
import Board from '@/components/board/board'
import { ProjectType } from '@/types/projectType'
import React, { useEffect, useState } from 'react'

const Project = ({ params }: { params: { projectId: string } }) => {

    
    const [project, setProject] = useState<ProjectType | null>(null);
    
    const getData = async () => {
        const res = await getProject(params.projectId) as ProjectType;
        setProject(res);
    }
   

    useEffect(() => {
        getData();
    }, []);

    

    return (
        <div className='flex justify-center items-center'>
            {/* <ProjectClient project={project} /> */}
            <Board  project={project}/>
        </div>
    )
}

export default Project
