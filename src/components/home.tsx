import { User } from "firebase/auth";
import Navbar from "@/components/navigationBar/navbar";
interface HomeProps {
    user:User;
}

export const Home = () => {
    return (
        <div>
            <Navbar />
        </div>
    )
}