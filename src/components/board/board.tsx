'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import MainBoard from '../mainBoard/mainBoard';
import { getBoard, updateBoard } from '@/backend/boards';
import { BoardType, DNDType, ProjectType } from '@/types';

interface BoardProps {
    project: ProjectType | null;
    // setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
}

export default function Board({ project }: BoardProps) {

    const [board, setBoard] = useState<BoardType | null>(null);
    const [boardName, setBoardName] = useState<string>("BoardName");
    const [projectName,setProjectName] = useState<string>('ProjectName');
    const [boardNameisEditable, setBoardNameisEditable] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const getProjectBoard = async () => {
        if (project) {
            const res = await getBoard(project.boards[0]) as BoardType;
            setBoard(res);
            setBoardName(res.boardName);
            setProjectName(project.projectName)
        }
    }

    useEffect(() => {
        getProjectBoard();
    }, [project])

    const updateName = async () => {
        try {
            if(boardName.length==0 || boardName===board?.boardName)
                    return;

            await updateBoard(board?.id!, boardName);
            setBoardNameisEditable(false);
        } catch(e){
            console.log(e);
        }
    }

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
       if(e.key === 'Enter')
            updateName();
    };

    

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            if (inputRef.current && !inputRef.current.contains(event.target as Node)){
               setBoardNameisEditable(false)
            }
            
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {
                project ? (
                    <div className='flex flex-col w-[80vw] h-full mt-10 px-5 pt-8'>
                        <div>
                            <div className='text-[#44556f] dark:text-[#b6c2cf] text-sm '>
                                {`${projectName} / ${boardName}`}
                            </div>

                            <div className='h-16 flex items-center'>
                                {boardNameisEditable ? (
                                    <Input
                                        className='py-7 pr-3 pl-[30px] w-[30rem] text-2xl font-semibold border-blue-400 border-2 dark:text-[#b6c2cf] hover:bg-[#f7f8f9] dark:hover:bg-[#1d2125]'
                                        ref={inputRef}
                                        type='text'
                                        value={boardName}
                                        onChange={(e) => setBoardName(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder='Enter project name...'
                                    />
                                ) : (
                                    <Button onClick={() => setBoardNameisEditable(true)} className='py-7 pr-3 pl-0 text-2xl font-semibold text-black dark:text-[#b6c2cf] dark:bg-transparent bg-white  hover:bg-[#f7f8f9] dark:hover:bg-[#313539]'>
                                        {boardName}
                                    </Button>
                                )}
                            </div>

                            <Input
                                className='py-4 pr-3 w-[10rem] text-sm  rounded-none bg-transparent'
                                type='text'
                                placeholder='Search this board'
                            />
                        </div>
                        <MainBoard board={board}/>
                    </div>
                ) : (
                    <div className='flex flex-col w-[80vw] h-full px-5'>
                        <h1 className='text-2xl font-semibold text-center mt-20'>
                            No projects found. Create a project to get started.
                        </h1>
                    </div>
                )
            }
        </>
    );
}