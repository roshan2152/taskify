"use client"

import { useEffect, useState } from 'react';
import { User,onAuthStateChanged, signInWithPopup } from "firebase/auth";

import {
	CirclePlus,
	Columns3,
	BadgeAlert,
} from 'lucide-react'
import { Project } from '@/types/projectType'
import Modal from '../Modal/modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { auth } from '@/dbConfig/auth';
import { getProjects,createProject } from "@/backend/projects";
import { ProjectList } from '../projectList/projectList';


export default function Sidebar() {

	const [showCreateProjectModal,setShowCreateProjectModal] = useState<boolean>(false);
	const [projectName,setProjectName] = useState<string>('');
	const [user,setUser] = useState<User | null>(null);
	const [isLoading , setIsLoading] = useState<boolean>(true);
	const [isCreatingProject,setIsCreatingProject] = useState<boolean>(false);

	const [projects,setProjects] = useState<Project[]>([]);

	const onCreateProject = async () => {
		setIsCreatingProject(true);
		console.log(user?.uid)
		const project = {
			id: user?.uid,
			name: projectName,
		}
		
		const newProject = await createProject(project, user?.uid)
		console.log(newProject);
		setProjects([...projects,newProject as Project])
		setIsCreatingProject(false);
		setShowCreateProjectModal(false);	
	}
	

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setIsLoading(false);
		});
		return () => unsubscribe();
	},[user])
	
	return (
		<>
			<div className= {`${!user && `hidden`} flex flex-col justify-between px-5 text-primary w-[20%] dark:bg-transparent border-r-2 border-slate-300 dark:border-[#282e34] h-full pt-16`}>
				<Modal showModal={showCreateProjectModal} setShowModal={setShowCreateProjectModal}>
					<div className='flex flex-col gap-y-4'>
						<Input placeholder='Project name' onChange={(e) => setProjectName(e.target.value)} disabled={isCreatingProject}/>
						<Button onClick={onCreateProject} size='sm' variant='default' disabled={isCreatingProject} >{isCreatingProject? "Creating your project..." :"Create Project"}</Button>
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
				<div className='flex flex-col justify-center items-center pb-3'>
					<p className='text-[#44556f] text-xs'>You're in a team-managed project</p>
					<button className='text-[#44556f] text-xs font-semibold'>Learn more</button>
				</div>
			</div>
		</>
	)
}
