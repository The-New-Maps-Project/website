import { pAuth } from "../services/config";
import {useRouter} from "next/router"
import { useContext } from "react";
import PContext from "../services/context";

export default function Account(){
    const router = useRouter()
    const {setDocId} = useContext(PContext);

    setDocId(null); //exit out of editing a map mode when you go to the account page.

    const logout = async () =>{
        try{
            await pAuth.signOut();
            router.push("/");
        }catch(e){
            console.error(e);
        }
    }

    return <div id="account">
        {pAuth.currentUser&&<div>
            <h3>{pAuth.currentUser&&pAuth.currentUser.email}</h3>
            <button className="sb" onClick={logout}>Logout</button>
        </div>}
    </div>
}