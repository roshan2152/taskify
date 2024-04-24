import { GoogleAuthProvider,getAuth } from "firebase/auth";
import App from "./dbConfig";

const provider = new GoogleAuthProvider();
const auth = getAuth(App);

export {provider, auth}