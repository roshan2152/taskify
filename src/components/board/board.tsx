'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import MainBoard from '../mainBoard/mainBoard';
import { getBoard, updateBoard } from '@/backend/boards';
import { BoardType, MemberType, DNDType, ProjectType } from '@/types';
import Modal from '../Modal/modal';
import { UserPlus } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateProject } from '@/backend/projects';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/dbConfig/auth';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

interface BoardProps {
    project: ProjectType | null;
    // setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
}

export default function Board({ project }: BoardProps) {

    const [board, setBoard] = useState<BoardType | null>(null);
    const [boardName, setBoardName] = useState<string>("BoardName");
    const [projectName, setProjectName] = useState<string>('ProjectName');
    const [boardNameisEditable, setBoardNameisEditable] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [showMemberModal, setShowMemberModal] = useState<boolean>(false);
    const [memberData, setMemberData] = useState({
        name: '',
        email: '',
        role: '',
    });


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
            if (boardName.length == 0 || boardName === board?.boardName)
                return;

            await updateBoard(board?.id!, boardName);
            setBoardNameisEditable(false);
        } catch (e) {
            console.log(e);
        }
    }

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter')
            updateName();
    };



    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setBoardNameisEditable(false)
            }

        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addMember = async () => {
        // check member data
        if (memberData.name.length === 0 || memberData.email.length === 0 || memberData.role.length === 0) {
            alert('Please enter all fields..');
            return;
        }

        try {
            if (project) {
                await updateProject(project.id, memberData);
                console.log(123);
                await sendSignInLinkToEmail(auth, memberData.email, {
                    url: `http://localhost:3000/${project.boards[0]}`,
                    handleCodeInApp: true,
                });
                console.log('Mail sent');
            }

        } catch (err) {
            console.log(err);
        } finally {
            setMemberData({
                name: '',
                email: '',
                role: '',
            });
            setShowMemberModal(false);
        }
    };
    const rephraseName = (name: string) => {
        const newName = name.split(' ');

        return newName[0][0] + newName[1][0];
    }

    return (
        <>
            <Modal
                showModal={showMemberModal}
                setShowModal={setShowMemberModal}
            >
                <div className="flex flex-col w-full items-start gap-y-4">
                    <h1 className="text-gray-800 text-3xl font-bold">Add Member</h1>
                    <Input
                        required
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={memberData.name}
                        onChange={(e) => setMemberData({ ...memberData, name: e.target.value })}
                    />
                    <Input
                        required
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={memberData.email}
                        onChange={(e) => setMemberData({ ...memberData, email: e.target.value })}
                    />
                    <Select onValueChange={(e) => setMemberData({ ...memberData, role: e })} defaultValue={memberData.role}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem className='cursor-pointer' value="admin">Admin</SelectItem>
                                <SelectItem className='cursor-pointer' value="member">Member</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button onClick={addMember}>Add</Button>
                </div>
            </Modal>
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
                            <div className='flex items-center'>
                                <Input
                                    className='py-4 pr-3 w-[10rem] text-sm  rounded-none bg-transparent mr-5'
                                    type='text'
                                    placeholder='Search this board'
                                />
                                {project.members?.length > 0 &&
                                    project.members.map((member: MemberType, index) => {
                                        return (
                                            <Avatar key={index} className='cursor-pointer'>
                                                <AvatarImage alt={member.name} />
                                                <AvatarFallback>{rephraseName(member.name)}</AvatarFallback>
                                            </Avatar>
                                        )
                                    })
                                }
                                <UserPlus className='ml-5 h-6 w-6 cursor-pointer' onClick={() => setShowMemberModal(true)} />
                            </div>
                        </div>
                        <MainBoard board={board} />
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