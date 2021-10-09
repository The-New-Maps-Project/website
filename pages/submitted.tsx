import { signInWithEmailAndPassword,onAuthStateChanged,signOut } from "firebase/auth";
import { useEffect, useState } from "react"
import { auth, pFirestore, storage } from "../services/config"
import ArrowLink from "../components/ArrowLink";
import { updateDoc, doc,getDoc,setDoc } from "firebase/firestore/lite";
import { ref,uploadBytes,getDownloadURL,deleteObject } from "firebase/storage";

export default function Submitted(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [link,setLink] = useState("");
    const [imageUrl,setImageUrl] = useState("");
    const [user,setUser] = useState<string|null>(null);
    const [error,setError] = useState<string|null>(null);
    const [docs,setDocs] = useState([]);
    const [file,setFile] = useState<File|null>(null);
    const [showLogin,setShowLogin] = useState<boolean>(false);
    


    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setUser(user.email);
            }else{
                setUser(null);
            }
        })
        try{
        
        const list = getDoc(doc(pFirestore,"submitted","submitted")).then(doc=>{
            console.log(doc)
            var arr = [];
            var keys = Object.keys(doc.data());
            keys.forEach(key=>{
                arr.push(doc.data()[key]);
            })
            setDocs(arr);
        })
        }catch(e){
            console.error(e);
        }
    },[])

    useEffect(()=>{
        setError(null);
    },[email,password])

    const signIn = async () =>{
        try{
            var userCredentials = await signInWithEmailAndPassword(auth,email,password)
        }catch(e){
            console.error(e);
            setError(e.message)
        }
    }

    const signOut1 = async () =>{
        try{
            await signOut(auth);
        }catch(e){
            console.error(e);
        }
    }

    const addMap = async () => {
        if(!title) return;
        var n = (new Date()).getTime();
        var obj = {
            title: title,
            description: description,
            id: n,
            link: link,
            imageUrl: imageUrl,
        }
        try{
            var n = (new Date()).getTime();
            console.log(typeof pFirestore)
            await updateDoc(doc(pFirestore,"submitted","submitted"),{[n]: obj});
           setTitle("");
           setDescription("");
           setLink("");
           setImageUrl("");
           setDocs([...docs,obj])
        }catch(e){
            console.error(e);
        }
    }

    const uploadImage = async () => {
        if(!file) return;
        var d = (new Date).getTime();
        const storageRef = ref(storage,`submitted/${d}`)
        try{
            var snapshot = await uploadBytes(storageRef,file);
            var imageUrl1 = await getDownloadURL(snapshot.ref)
            setImageUrl(imageUrl1)
            setFile(null);
        }catch(e){
            console.error(e);
        }
    }

    //find the document by imageUrl
    const deleteDoc = async (id) => {
        const newDocs = docs.filter(d=>d.id!=id);
        try{
            setDocs(newDocs);
            var newObj = {};
            newDocs.forEach(d=>newObj[d.id]=d);
            await setDoc(doc(pFirestore,"submitted","submitted"),newObj)
        }catch(e){
            console.error(e);

        }
    }


    return <div id="submitted" >
        {user&&<span id="user">User: {user}</span>}
        <div className="page-header">
            <h2>Maps Published and Submitted</h2>
            <p>All maps are created by The New Maps Project creator Vincent Cai</p>
        </div>
        {user&&<section id="addmap">
            {imageUrl&&<div className="image" style={{backgroundImage: `url(${imageUrl})`}}></div>}
            {!imageUrl&&<input type="file" onChange={e=>setFile(e.target.files[0])}></input>}
            {file&&!imageUrl&&<button className="sb" onClick={uploadImage}>Upload</button>}
            <input style={{fontWeight: 'bold',fontSize: "20px"}}placeholder="Map Title" onChange={e=>setTitle(e.target.value)} value={title}></input>
            <input placeholder="Description" onChange={e=>setDescription(e.target.value)} value={description}></input>
            <input placeholder="Link" onChange={e=>setLink(e.target.value)} value={link}></input>
            <button onClick={addMap} className="sb">Submit</button>
        </section>}
        <ul id="allmaps">
            {docs.sort((a,b)=>b.id-a.id).map(d=><li>
                <div className="image" style={{backgroundImage: `url(${d.imageUrl})`}}></div>
                <h6>{d.title}</h6>
                <p>{d.description}</p>
                <ArrowLink href={d.link||"/"} text="Link to Map"></ArrowLink>
                {user&&<button onClick={()=>deleteDoc(d.id)} className="delete-button">Delete</button>}
            </li>)}
        </ul>
        <button className="tb showLogin" onClick={()=>setShowLogin(!showLogin)}>{showLogin?"Hide":"Show"} Login</button>
        {showLogin&&<section id="login-area">
            {!user?<div>
                <input placeholder="email" onChange={e=>setEmail(e.target.value)} value={email}></input>
                <input placeholder="password" type="password" onChange={e=>setPassword(e.target.value)} value={password}></input>
                <button className="sb" onClick={signIn}>Login</button>
                {error&&<div>{error}</div>}
            </div>:<div><button className="sb" onClick={signOut1}>Logout</button></div>}
        </section>}
    </div>
}