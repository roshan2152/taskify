import { Button } from "@/components/ui/button";
import { User } from "firebase/auth";
import { LogIn } from "lucide-react";


interface LoginProps {
    user: null | User,
    signIn: () => Promise<void>
}

export const Login = ({user,signIn}:LoginProps) => {

    return (<div className="flex items-center justify-center border-2 h-[100vh]">
        <Button
            size="lg"
            variant="default"
            onClick={signIn}
        >
            <LogIn className="w-4 h-4 mr-2"/>
            Login
        </Button>
    </div>)
}