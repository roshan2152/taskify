import { Login } from "@/components/login";
import { getUser, loginUser } from "@/backend/user";
import { UserType } from "@/types/userType";

const Landing = () => {

    return (
        <>  
            <Login />
        </>
    );
};
export default Landing