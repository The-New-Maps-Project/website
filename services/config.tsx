import {initializeApp,getApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore/lite";
import {getStorage} from "firebase/storage";

const firebaseConfig = ({
    apiKey: "AIzaSyDXGckWI1oue6X0RItXzYgCEoAHDsp_-gQ",
    authDomain: "weighty-forest-287112.firebaseapp.com",
    databaseURL: "https://weighty-forest-287112.firebaseio.com",
    projectId: "weighty-forest-287112",
    storageBucket: "weighty-forest-287112.appspot.com",
    messagingSenderId: "631508830721",
    appId: "1:631508830721:web:7aab848bad5d6e033b0e00",
    measurementId: "G-EK4XB2BSG4"
});

let firebaseApp;
try {
  firebaseApp = getApp();
} catch (e) {
  firebaseApp = initializeApp(firebaseConfig);
}


const auth = getAuth(firebaseApp);
const pFirestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export {auth,pFirestore,storage}