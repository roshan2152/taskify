"use client"

import { useEffect, useState } from 'react';

import {
	CirclePlus,
	Columns3,
	BadgeAlert,
	TriangleAlert
} from 'lucide-react'
import Modal from '../Modal/modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { createProject, getProject, getProjectsByUserId } from "@/backend/projects";
import { ProjectList } from '../projectList/projectList';
import { getUser } from '@/backend/user';
import { useAuth } from '@/context/authContext';
import { addBoard } from '@/backend/boards';
import { BoardType, ProjectType, UserType } from '@/types';


export default function Sidebar() {

	const [showCreateProjectModal, setShowCreateProjectModal] = useState<boolean>(false);
	const [projectName, setProjectName] = useState<string>('');

	const { user, isLoading } = useAuth();
	const [projects, setProjects] = useState<ProjectType[]>([]);

	const [isCreatingProject, setIsCreatingProject] = useState<boolean>(false);
	const [nameExists, setNameExists] = useState<boolean>(false);

	const getUserProjects = async () => {
		const userProjects = await getProjectsByUserId(user?.uid) as ProjectType[];
		setProjects(userProjects)
	}

	useEffect(() => {
		if (user) {
			getUserProjects();
		}
	}, [user]);

	const onCreateProject = async () => {
		setIsCreatingProject(true);

		try {
			const projectExists = projects.some(project => project.projectName === projectName);
			if (projectExists) {
				setNameExists(true);
				setIsCreatingProject(false);
				setShowCreateProjectModal(true);
				return;
			}

			const newProject = await createProject(projectName, user?.uid) as ProjectType;

			setProjects([...projects, newProject]);
			if(nameExists) setNameExists(false);
			setIsCreatingProject(false);
			setShowCreateProjectModal(false);	
		} catch (err) {
			console.log(err);
		} 
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			onCreateProject();
		}
	};
	

	return (
		<>
			{isLoading && (<div className={`flex flex-col justify-between px-5 text-primary w-[20%] bg-white dark:bg-slate-900 border-r-2 border-slate-300 dark:border-[#282e34] h-full pt-16`}>Loading...</div>)}

			{!isLoading && !user && <div className={`flex flex-col justify-between px-5 text-primary w-[20%] bg-white dark:bg-slate-900 border-r-2 border-slate-300 dark:border-[#282e34] h-full pt-16`}>Please Login</div>}

			{!isLoading && user && (
			<div className={`flex flex-col justify-between px-5 text-primary w-[20%] bg-white dark:bg-slate-900 border-r-2 border-slate-300 dark:border-[#282e34] h-full pt-16 overflow-auto`}>
				<Modal showModal={showCreateProjectModal} setShowModal={setShowCreateProjectModal}>
					<div className='flex flex-col gap-y-4'>
						<Input placeholder='Project name' onChange={(e) => setProjectName(e.target.value)} onKeyDown={handleKeyDown} disabled={isCreatingProject} />
						<Button onClick={onCreateProject} size='sm' variant='default' disabled={isCreatingProject} >{isCreatingProject ? "Creating your project..." : "Create Project"}</Button>

						{nameExists && (
							<p className='flex flex-row items-center justify-center text-xs'>
								<TriangleAlert color="#f10909" size="15px" />
								&nbsp;
								The project name already exists.
							</p>
						)}

					</div>
				</Modal>
				<div className="flex flex-col flex-start">
					<div>
						<p className='text-[#44556f] text-sm font-bold dark:text-[#c4c5c6] p-3'>PLANNING</p>
						<button className='flex flex-row gap-4 text-[#44556f] rounded-md hover:bg-[#e9f2ff] dark:text-white dark:hover:bg-gray-700 text-sm p-3 w-full items-center'
							onClick={() => setShowCreateProjectModal(true)}
						>
							<CirclePlus
								className="group-hover:text-white transition text-bg-[#44556f]"
								size={20}
								strokeWidth={2.5}
							/>
							Add New Project
						</button>
						<button className='flex flex-row gap-4 text-[#44556f] rounded-md hover:bg-[#e9f2ff] dark:text-white dark:hover:bg-gray-700 text-sm p-3 w-full items-center'>
							<Columns3
								className="group-hover:text-white transition text-bg-[#44556f]"
								// size={20}
								strokeWidth={2.5} />
							Board
						</button>
						<button className='flex flex-row gap-4 text-[#44556f] rounded-md hover:bg-[#e9f2ff] dark:text-white dark:hover:bg-gray-700 text-sm p-3 w-full items-center'>
							<BadgeAlert
								className="group-hover:text-white transition text-bg-[#44556f]"
								size={20}
								strokeWidth={2.5} />
							Issues
						</button>

						<div>
							<ProjectList projects={projects} />
						</div>

					</div>
				</div>
				<div className='flex flex-col justify-center items-center pb-3 mt-8'>
					<p className='text-[#44556f] text-xs'>You are in a team-managed project</p>
					<button className='text-[#44556f] text-xs font-semibold'>Learn more</button>
				</div>
			</div>)}
		</>
	)
}