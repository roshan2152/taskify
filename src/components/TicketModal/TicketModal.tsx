import React, { Dispatch, SetStateAction, useState } from 'react';
import Modal from '../Modal/modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { MemberType, ProjectType } from '@/types';


interface TicketModalProps {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    project: ProjectType | null;
}

const TicketModal: React.FC<TicketModalProps> = ({ showModal, setShowModal, project }) => {

    const [ticketName,setTicketName] = useState('');
    const [ticketDescription,setTicketDescription] = useState('');

    const rephraseName = (name: string) => {
        const newName = name.split(' ');

        if (newName.length === 1) {
            return newName[0][0];
        } else {
            return newName[0][0] + newName[1][0];
        }
    }
    return (
        <div>
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <div className='flex flex-col gap-5'>
                    <div className="flex flex-col gap-5 w-full items-start">
                        <Input
                            onChange={(e) => setTicketName(e.target.value)}
                            type="text"
                            placeholder="Item Title"
                            name="itemname"
                            value={ticketName}
                            className='border-0 hover:bg-gray-200 focus:border-gray-200 text-lg font-bold'
                        />
                        <div className="flex flex-col gap-1 w-full items-start">
                            <Label>Description</Label>
                            <Textarea
                                onChange={(e) => setTicketDescription(e.target.value)}
                                placeholder="Description"
                                name="description"
                                value={ticketDescription}
                            />
                        </div>
                    </div>

                    <div className='flex flex-row gap-5'>
                        <Select>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {project && project.members?.length > 0 && project.members.map((member: MemberType, index) => (
                                        <SelectItem key={index} value={member.name} className="flex items-center py-2 px-4">
                                            <div className="flex items-center justify-between">
                                                <Avatar className="cursor-pointer ml-4 w-8 h-8">
                                                    <AvatarImage alt={member.name} className="w-full h-full" />
                                                    <AvatarFallback className="w-full h-full">{rephraseName(member.name)}</AvatarFallback>
                                                </Avatar>
                                                <span>{member.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {project && project.members?.length > 0 && project.members
                                        .filter((member: MemberType) => member.role === 'admin')
                                        .map((member: MemberType, index) => (
                                            <SelectItem key={index} value={member.name} className="py-2 px-4">
                                                <div className="flex items-center w-full">
                                                    <Avatar className="cursor-pointer ml-4 w-8 h-8">
                                                        <AvatarImage alt={member.name} className="w-full h-full" />
                                                        <AvatarFallback className="w-full h-full">{rephraseName(member.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{member.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={() => setShowModal(false)}>Update Ticket</Button>
                </div>
            </Modal>
        </div>
    );
};

export default TicketModal;
