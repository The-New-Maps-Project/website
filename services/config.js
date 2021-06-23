import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


var firebaseConfig = {
    apiKey: "AIzaSyAwJHicf4pmkwgy9E5hkq0h3UfBSsyb-kE",
    authDomain: "weighty-forest-287112.firebaseapp.com",
    databaseURL: "https://weighty-forest-287112.firebaseio.com",
    projectId: "weighty-forest-287112",
    storageBucket: "weighty-forest-287112.appspot.com",
    messagingSenderId: "631508830721",
    appId: "1:631508830721:web:e5efc39aaa7b2bf53b0e00",
    measurementId: "G-VC5Z9F68Z7"
  };
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const pAuth = firebase.auth();
const pDatabase = firebase.firestore();

export {pAuth,pDatabase};