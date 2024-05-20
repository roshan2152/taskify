'use client'
import { getProject } from '@/backend/projects'
import Board from '@/components/board/board'
import { ProjectType } from '@/types/projectType'
import React, { useEffect, useState } from 'react'
import ProjectClient from './page'
import { addBoard, getBoards } from '@/backend/boards'
import { BoardType } from '@/types/boardType'
import { Button } from '@/components/ui/button'
import Sidebar from '@/components/sidebar/sidebar'

const ProjectLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {


    // const [project, setProject] = useState<ProjectType | null>(null);
    // // const [boards, setBoards] = useState<BoardType[]>([]);

    // const getData = async () => {
    //     console.log(params.projectId)
    //     const res = await getProject(params.projectId) as ProjectType;
    //     console.log(project);
    //     setProject(res);
    // }


    // useEffect(() => {
    //     getData();
    // }, []);


    // console.log(project);
    // console.log(boards);


    // const createBoard = async () => {
    //     if (project) {
    //         console.log(project.id)
    //         const res = await addBoard(project?.id, "Board1") as BoardType;
    //         setProjectBoards([res, ...projectBoards]);

    //     }
    // }

    return (
        <>
            <Sidebar />
            <div className='flex justify-center'>
                {/* <ProjectClient project={project} /> */}
                {/* <Board project={project} /> */}
                {children}
            </div>
        </>
    )
}

export default ProjectLayout
