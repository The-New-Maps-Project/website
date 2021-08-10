import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore/lite";

var firebaseConfig = {
    apiKey: "AIzaSyB5dR_M5LglL5rK-2P5oA44lHduBUD8C2c",
    authDomain: "weighty-forest-287112.firebaseapp.com",
    databaseURL: "https://weighty-forest-287112.firebaseio.com",
    projectId: "weighty-forest-287112",
    storageBucket: "weighty-forest-287112.appspot.com",
    messagingSenderId: "631508830721",
    appId: "1:631508830721:web:12c9a8e47a3660603b0e00",
    measurementId: "G-WNX6CRT5Q3"
}

const firebaseApp = initializeApp(firebaseConfig);

const pStorage = getStorage();
const pFirestore = getFirestore();

export {firebaseApp,pStorage,pFirestore};