"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import SidebarComponent from "@/components/EduComps/SideBar"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, onValue } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBb1F9q9CW6yY4Yowg2WSk377qr6vZ6tTw",
  authDomain: "edusyncprod.firebaseapp.com",
  databaseURL: "https://edusyncprod-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "edusyncprod",
  storageBucket: "edusyncprod.appspot.com",
  messagingSenderId: "189742035984",
  appId: "1:189742035984:web:4b9f8ae08fcc16c007c695",
  measurementId: "G-G0WRWY2QDF"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const database = getDatabase(app)

export default function Page() {
  const [greeting, setGreeting] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [userName, setUserName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`)
        onValue(userRef, (snapshot) => {
          const data = snapshot.val()
          if (data && data.name) {
            setUserName(data.name)
          } else {
            setUserName(user.displayName || "User")
          }
        })
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const updateGreetingAndDate = () => {
      const currentHour = new Date().getHours()
      let greetingText = ""

      if (currentHour >= 5 && currentHour < 12) {
        greetingText = "Good morning"
      } else if (currentHour >= 12 && currentHour < 18) {
        greetingText = "Good afternoon"
      } else {
        greetingText = "Good evening"
      }

      setGreeting(greetingText)
      setCurrentDate(format(new Date(), "EEEE, MMMM do, yyyy"))
    }

    updateGreetingAndDate()
    const timer = setInterval(updateGreetingAndDate, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex h-screen w-full bg-background">
      <SidebarComponent />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto mt-10 sm:mt-0">
          <h1 className="text-2xl font-bold text-primary mb-2">
            {greeting}, {userName}
          </h1>
          <p className="text-base text-muted-foreground mb-8 flex items-center">
            <CalendarIcon className="mr-2" />
            {currentDate}
          </p>
        </div>
      </main>
    </div>
  )
}