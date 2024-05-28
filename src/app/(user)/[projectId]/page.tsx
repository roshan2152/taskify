'use client'
import { getProject } from '@/backend/projects'
import Board from '@/components/board/board'
import { ProjectType } from '@/types'
import { getAuth } from 'firebase/auth'
import React, { useEffect, useState } from 'react'

const Project = ({ params }: { params: { projectId: string } }) => {


    const [project, setProject] = useState<ProjectType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getData = async () => {
        const auth = getAuth();
        console.log(auth?.currentUser)

        // if (auth.currentUser) {
            const res = await getProject(params.projectId) as ProjectType;
            setProject(res);
            setIsLoading(false);
        // }
    }


    useEffect(() => {
        getData();
    }, []);



    return (
        <div className='flex justify-center items-center'>
            {isLoading && <p>Loading your project....</p>}
            {!isLoading && project && <Board project={project} />}
        </div>
    )
}

export default Project
