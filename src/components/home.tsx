import { User } from "firebase/auth";
import Navbar from "@/components/navigationBar/navbar";
interface HomeProps {
    user:User;
}

export const Home = ({user}:HomeProps) => {
    return (
        <div>
            <Navbar />
        </div>
    )
}