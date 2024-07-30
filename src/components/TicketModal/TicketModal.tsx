import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Modal from '../Modal/modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UniqueIdentifier } from "@dnd-kit/core";
import { getTicket, updateTicket } from "@/backend/tickets";

interface TicketModalProps {
    ticketId: UniqueIdentifier;
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

interface TicketProps {
    ticketName: string;
    description: string;
    comments: string;
    assignee: string | null;
    reporter: string | null;
    createdAt: Date;
}

const TicketModal: React.FC<TicketModalProps> = ({ ticketId, showModal, setShowModal }) => {
    const [ticket, setTicket] = useState<TicketProps | null>(null);

    const getTicketInfo = async () => {
        if (!ticketId) return;
        try {
            const ticketData = await getTicket(ticketId.toString()) as TicketProps;
            setTicket(ticketData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTicket((prevTicket) => (prevTicket ? { ...prevTicket, [name]: value } : null));
    };

    const handleSelectChange = (field: keyof TicketProps) => (value: string) => {
        setTicket((prevTicket) => (prevTicket ? { ...prevTicket, [field]: value } : null));
    };

    const updateTicketInfo = async () => {
        if (!ticketId || !ticket) return;
        try {
            await updateTicket(ticketId.toString(), ticket);
            setShowModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (showModal && ticketId) {
            getTicketInfo();
        }
    }, [ticketId, showModal]);

    if (!ticket) return null;


    return (
        <div>
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <div className='flex flex-col gap-5'>
                    <div className="flex flex-col gap-5 w-full items-start">
                        <Input
                            type="text"
                            placeholder="Item Title"
                            name="ticketName"
                            value={ticket.ticketName}
                            onChange={handleInputChange}
                            className='border-0 hover:bg-gray-200 focus:border-gray-200 text-lg font-bold'
                        />
                        <div className="flex flex-col gap-1 w-full items-start">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Description"
                                name="description"
                                value={ticket.description}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className='flex flex-row gap-5 justify-center items-center'>
                        <div className="flex flex-row w-full items-center gap-2">
                            <Label>Assignee:</Label>
                            <Select onValueChange={handleSelectChange('assignee')}>
                                <SelectTrigger>
                                    <SelectValue placeholder={ticket.assignee}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Sunil">Sunil</SelectItem>
                                        <SelectItem value="Manpreet">Manpreet</SelectItem>
                                        <SelectItem value="Roshan">Roshan</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-row w-full items-center gap-2">
                            <Label>Reporter:</Label>
                            <Select onValueChange={handleSelectChange('reporter')}>
                                <SelectTrigger>
                                    <SelectValue placeholder={ticket.reporter}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Sunil">Sunil</SelectItem>
                                        <SelectItem value="Manpreet">Manpreet</SelectItem>
                                        <SelectItem value="Roshan">Roshan</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button onClick={updateTicketInfo}>Save</Button>
                    <Button onClick={() => setShowModal(false)}>Close</Button>
                </div>
            </Modal>
        </div>
    );
};

export default TicketModal;
