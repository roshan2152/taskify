import React from 'react'
import {
	CirclePlus,
	Columns3,
	BadgeAlert
} from 'lucide-react'
import { ProjectType } from '@/types/projectType'
import Modal from '../Modal/modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ProjectList } from '../projectList/projectList';
import { createProject } from '@/backend/projects';
import { auth } from '@/dbConfig/auth';

interface SidebarProps {
	projects: ProjectType[],
	setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>
}

export default function Sidebar({ projects, setProjects }: SidebarProps) {

	const [showCreateProjectModal, setShowCreateProjectModal] = React.useState<boolean>(false);
	const [projectName, setProjectName] = React.useState<string>('');


	const onCreateProject = async () => {
		if (projectName === '') { 
			return alert('Project name is required');
		} 

		try {
			const res = await createProject(projectName, auth.currentUser?.uid) as ProjectType;
			console.log(res);
			setProjects([...projects, res]);
		} catch (err) {
			console.log(err)
		} finally {
			setShowCreateProjectModal(false);
			setProjectName('');
		}
	};

	return (
		<div className="flex flex-col justify-between px-5 text-primary w-[20vw] dark:bg-transparent border-r-2 border-[#dddfe5] dark:border-[#282e34] h-full ">
			<Modal showModal={showCreateProjectModal} setShowModal={setShowCreateProjectModal}>
				<div className='flex flex-col gap-y-4'>
					<Input placeholder='Project name' onChange={(e) => setProjectName(e.target.value)} />
					<Button onClick={onCreateProject} size='sm' variant='default'>Create Project</Button>
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
				<p className='text-[#44556f] text-xs'>You are in a team-managed project</p>
				<button className='text-[#44556f] text-xs font-semibold'>Learn more</button>
			</div>
		</div>
	)
}
