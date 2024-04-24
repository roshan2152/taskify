import { User } from "firebase/auth";


interface HomeProps {
    user:User;
}


export const Home = ({user}:HomeProps) => {
    return (
        <div>
            <h1>Welcome to the Taskify {user.displayName}</h1>
        </div>
    )
}