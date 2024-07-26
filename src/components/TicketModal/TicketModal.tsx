import React, { Dispatch, SetStateAction } from 'react';
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


interface TicketModalProps {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

const TicketModal: React.FC<TicketModalProps> = ({ showModal, setShowModal }) => {
    return (
        <div>
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <div className='flex flex-col gap-5'>
                    <div className="flex flex-col gap-5 w-full items-start">
                        <Input
                            type="text"
                            placeholder="Item Title"
                            name="itemname"
                            value='Ticket Name'
                            className='border-0 hover:bg-gray-200 focus:border-gray-200 text-lg font-bold'
                        />
                        <div className="flex flex-col gap-1 w-full items-start">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Description"
                                name="description"
                                value='12'
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
                                    <SelectItem value="est">Sunil</SelectItem>
                                    <SelectItem value="cst">Manpreet</SelectItem>
                                    <SelectItem value="mst">Roshan</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Reporter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="est">Sunil</SelectItem>
                                    <SelectItem value="cst">Manpreet</SelectItem>
                                    <SelectItem value="mst">Roshan</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={() => setShowModal(false)}>Add Ticket</Button>
                </div>
            </Modal>
        </div>
    );
};

export default TicketModal;
