import React from 'react'
import {
	CirclePlus,
	Settings,
	SquareGanttChart,
	Columns3,
	BadgeAlert
} from 'lucide-react'
import { Separator } from '../ui/separator'

export default function Sidebar() {
	return (
		<div className="flex flex-col justify-between px-5 text-primary w-[20vw] dark:bg-transparent border-r-2 border-[#dddfe5] dark:border-[#282e34] h-full ">
			<div className="flex flex-col flex-start">
				<div>
					<p className='text-[#44556f] text-sm font-bold dark:text-[#c4c5c6] p-3'>PLANNING</p>
					<button className='flex flex-row gap-4 text-[#44556f] rounded-md hover:bg-[rgb(215,216,217)] dark:text-white dark:hover:bg-gray-700 text-sm p-3 w-full items-center flex-wrap'>
						<SquareGanttChart
							className="group-hover:text-white transition text-bg-[#44556f]"
							size={20}
							strokeWidth={2.5} />
						Timeline
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
				</div>

				<div>
					<button className='flex flex-row gap-4 text-[#44556f] rounded-md hover:bg-[#e9f2ff] dark:text-white dark:hover:bg-gray-700 text-sm p-3 w-full items-center'>
						<CirclePlus
							className="group-hover:text-white transition text-bg-[#44556f]"
							size={20}
							strokeWidth={2.5}
						/>
						Add New Project
					</button>
					<button className='flex flex-row gap-4 text-[#44556f] rounded-md hover:bg-[#e9f2ff] dark:text-white dark:hover:bg-gray-700 text-sm p-3 w-full items-center'>
						<Settings
							className="group-hover:text-white transition text-bg-[#44556f]"
							size={20}
							strokeWidth={2.5} />
						Project settings
					</button>
				</div>
			</div>
			<div className='flex flex-col justify-center items-center pb-3'>
				<p className='text-[#44556f] text-xs'>You're in a team-managed project</p>
				<button className='text-[#44556f] text-xs font-semibold'>Learn more</button>
			</div>
		</div>
	)
}
