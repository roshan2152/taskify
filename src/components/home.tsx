import { User } from "firebase/auth";
import Navbar from "@/components/navigationBar/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import Board from "./board/board";

interface HomeProps {
    user: User;
}

export const Home = ({ user }: HomeProps) => {
    return (
        <div className="h-screen dark:bg-[#1d2125]">
            <Navbar />
            <div className="flex flex-row pt-16 h-full">
                <div className="hidden md:flex">
                    <Sidebar />
                </div>
                <Board />
            </div>
        </div>
    )
}