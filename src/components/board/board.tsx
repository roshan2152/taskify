'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import MainBoard from '../mainBoard/mainBoard';
import { getBoard, updateBoard } from '@/backend/boards';
import { ProjectType } from '@/types/projectType';
import { BoardType } from '@/types/boardType';

interface BoardProps {
    project: ProjectType | null;
    // setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
}

export default function Board({ project }: BoardProps) {

    const [board, setBoard] = useState<BoardType | null>(null);

    const getProjectBoard = async () => {
        if (project) {
            const res = await getBoard(project?.boards[0]) as BoardType;
            setBoard(res);
        }
    }
    console.log(board);

    useEffect(() => {
        getProjectBoard();
    }, [project])

    // console.log(projectBoards);
    console.log(project);
    console.log(project?.boards[0]);


    const [boardName, setBoardName] = useState<string>("BoardName");
    const [boardNameisEditable, setBoardNameisEditable] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleBoardNameEditable = () => {
        setBoardNameisEditable(!boardNameisEditable);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            toggleBoardNameEditable();
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 30) {
            setBoardName(value);

            const boardId = '';

            try {
                await updateBoard(boardId, boardName);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
            setBoardNameisEditable(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {
                project ? (
                    <div className='flex flex-col w-[80vw] h-full mt-10 px-5'>
                        <div>
                            <div className='text-[#44556f] dark:text-[#b6c2cf] text-sm '>
                                projectName / boardName
                            </div>

                            <div className='h-16 flex items-center'>
                                {boardNameisEditable ? (
                                    <Input
                                        className='py-7 pr-3 pl-[30px] w-[30rem] text-2xl font-semibold border-blue-400 border-2 dark:text-[#b6c2cf] hover:bg-[#f7f8f9] dark:hover:bg-[#1d2125]'
                                        ref={inputRef}
                                        type='text'
                                        value={boardName}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyPress}
                                    />
                                ) : (
                                    <Button onClick={toggleBoardNameEditable} className='py-7 pr-3 pl-0 text-2xl font-semibold text-black dark:text-[#b6c2cf] dark:bg-transparent bg-white  hover:bg-[#f7f8f9] dark:hover:bg-[#313539]'>
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
                        <MainBoard board={ board} />
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