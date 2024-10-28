"use client"

import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Compass, GraduationCap, Settings, User as UserIcon, LogOut, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Sidebar, SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { initializeApp } from "firebase/app"
import { getAuth, signOut, User as FirebaseUser } from "firebase/auth"
import { getDatabase, ref, onValue, off } from "firebase/database"

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

interface UserData {
  name: string
  photoURL?: string
}

const SidebarContent: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const { collapsed, setCollapsed } = useSidebar()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const userRef = ref(database, `users/${currentUser.uid}`)
        onValue(userRef, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            setUserData({
              ...data,
              photoURL: currentUser.photoURL || data.photoURL
            })
          } else {
            setUserData({
              name: currentUser.displayName || '',
              photoURL: currentUser.photoURL
            })
          }
        })
      } else {
        setUserData(null)
      }
    })

    return () => {
      unsubscribe()
      if (user) {
        const userRef = ref(database, `users/${user.uid}`)
        off(userRef)
      }
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error("Error signing out: ", error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-grow p-4">
        <nav className="space-y-2">
          <div 
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-lg font-semibold",
              "text-primary"
            )}
          >
            {collapsed && !isMobile ? "ES" : "EduSync"}
          </div>
          <Link 
            href="/planner"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
              pathname === "/planner" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <Calendar className="h-4 w-4" />
            {(!collapsed || isMobile) && <span>Planner</span>}
          </Link>
          <Link 
            href="/edupath"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
              pathname === "/edupath" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <Compass className="h-4 w-4" />
            {(!collapsed || isMobile) && <span>EduPath</span>}
          </Link>
          <Link 
            href="/tutoring"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
              pathname === "/tutoring" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <GraduationCap className="h-4 w-4" />
            {(!collapsed || isMobile) && <span>Tutoring</span>}
          </Link>
        </nav>
      </div>
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              <div className="flex items-center gap-2 w-full">
                <Avatar>
                  <AvatarImage src={userData?.photoURL || undefined} alt={userData?.name || "User"} />
                  <AvatarFallback>{userData?.name?.[0] || user.email?.[0] || "U"}</AvatarFallback>
                </Avatar>
                {(!collapsed || isMobile) && (
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">{userData?.name || user.displayName || "User"}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

const SidebarComponent: React.FC = () => {
  return (
    <div className="fixed">
      <SidebarProvider>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 fixed inset-y-0 left-0 z-50">
              <SidebarContent isMobile />
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden md:block">
          <Sidebar className="border-r w-64">
            <SidebarContent />
          </Sidebar>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default SidebarComponent