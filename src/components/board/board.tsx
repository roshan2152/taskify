import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import MainBoard from '../mainBoard/mainBoard';

export default function Board() {
    const [boardName, setBoardName] = useState("BoardName");
    const [boardNameisEditable, setBoardNameisEditable] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleBoardNameEditable = () => {
        setBoardNameisEditable(!boardNameisEditable);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            toggleBoardNameEditable();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 30) {
            setBoardName(value);
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
        <div className=' flex flex-col w-[80vw] h-full px-5'>
            <div>
                <div className='text-[#44556f] dark:text-[#b6c2cf] text-sm mb-3'>
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
            <MainBoard />
        </div>
    );
}