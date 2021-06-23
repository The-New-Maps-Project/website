import { useState } from "react"
import {pAuth} from "../services/config";

export default function Auth(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [errorMessage,setErrorMessage] = useState("");

    const login = async () =>{
        try{
            await pAuth.signInWithEmailAndPassword(email,password);
        }catch(e){
            setErrorMessage(e.message);
        }
    }

    const createUser = async () =>{
        try{
            await pAuth.createUserWithEmailAndPassword(email,password);
        }catch(e){
            setErrorMessage(e.message)
        }
    }


    return <div id="auth">
            <h4>Account</h4>
            <input 
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Email"
                value={email}
            ></input>
            <input 
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Password"
                value={password}
                type="password"
            ></input>
            {errorMessage&&<p className="error-message">{errorMessage}</p>}
            <div className="auth-buttons">
                <button className="sb" onClick={login}>Login</button>
                <button className="sb" onClick={createUser}>Create Account</button>
            </div>
    </div>
}