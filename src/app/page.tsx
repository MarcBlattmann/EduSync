"use client";
import NavBar from "@/components/EduComps/NavBar";
import LandingPageComp from "@/components/EduComps/LandingPage";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database"

export default function LandingPage() {
    const firebaseConfig = {
      apiKey: "AIzaSyBb1F9q9CW6yY4Yowg2WSk377qr6vZ6tTw",
      authDomain: "edusyncprod.firebaseapp.com",
      databaseURL: "https://edusyncprod-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "edusyncprod",
      storageBucket: "edusyncprod.appspot.com",
      messagingSenderId: "189742035984",
      appId: "1:189742035984:web:4b9f8ae08fcc16c007c695",
      measurementId: "G-G0WRWY2QDF"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app)
    return (
      <>
        <NavBar/>
        <LandingPageComp database={database} app={app}/>
      </>
    );
  }
  