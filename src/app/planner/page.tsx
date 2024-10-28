'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, Clock, Plus, X, ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import SidebarComponent from "@/components/EduComps/SideBar"

import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, set, remove, onValue, off } from "firebase/database"

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

interface Event {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  description: string
  isWholeDay: boolean
}

export default function Planner() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [view, setView] = useState<'day' | 'month'>('month')
  const [user, setUser] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // Load events from Firebase
        const eventsRef = ref(database, `users/${currentUser.uid}/events`)
        onValue(eventsRef, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const eventList = Object.values(data) as Event[]
            setEvents(eventList)
          } else {
            setEvents([])
          }
        })
      } else {
        setEvents([])
      }
    })

    return () => {
      unsubscribe()
      // Detach the Firebase listener when component unmounts
      if (user) {
        const eventsRef = ref(database, `users/${user.uid}/events`)
        off(eventsRef)
      }
    }
  }, [user])

  const addEvent = (event: Omit<Event, 'id'>) => {
    if (!user) return
    const newEvent = { ...event, id: Date.now() }
    set(ref(database, `users/${user.uid}/events/${newEvent.id}`), newEvent)
  }

  const removeEvent = (id: number) => {
    if (!user) return
    remove(ref(database, `users/${user.uid}/events/${id}`))
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const eventsForSelectedDate = events.filter(
    event => new Date(event.date).toDateString() === selectedDate.toDateString()
  )

  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay()
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 border-r p-4 overflow-auto">
          <SidebarComponent />
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="md:hidden">
            <SidebarComponent />
          </div>
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 p-4 border-b">
              <div>
                <CardTitle className="text-2xl font-bold">Planner</CardTitle>
                <CardDescription>{selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="default" size="icon">
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add event</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        addEvent({
                          title: formData.get('title') as string,
                          date: (formData.get('date') as string),
                          startTime: formData.get('startTime') as string,
                          endTime: formData.get('endTime') as string,
                          description: formData.get('description') as string,
                          isWholeDay: formData.get('isWholeDay') === 'on',
                        })
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input 
                          id="date" 
                          name="date" 
                          type="date" 
                          required 
                          defaultValue={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`}
                          onChange={(e) => {
                            const [year, month, day] = e.target.value.split('-').map(Number);
                            setSelectedDate(new Date(year, month - 1, day));
                          }}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="isWholeDay" name="isWholeDay" />
                        <Label htmlFor="isWholeDay">Whole day event</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input id="startTime" name="startTime" type="time" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endTime">End Time</Label>
                          <Input id="endTime" name="endTime" type="time" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" />
                      </div>
                      <Button type="submit" className="w-full">Add Event</Button>
                    </form>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4">
              <Tabs value={view} onValueChange={(v) => setView(v as 'day' | 'month')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                </TabsList>
                <TabsContent value="month">
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="font-semibold text-sm py-2">{day}</div>
                    ))}
                    {Array.from({ length: firstDayOfMonth }, (_, i) => (
                      <div key={`empty-${i}`} className="h-20 md:h-24 border border-border rounded-md"></div>
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1)
                      const dayEvents = events.filter(event => new Date(event.date).toDateString() === date.toDateString())
                      const wholeDayEvents = dayEvents.filter(event => event.isWholeDay)
                      const timedEvents = dayEvents.filter(event => !event.isWholeDay)
                      return (
                        <div
                          key={i}
                          className={cn(
                            "h-20 md:h-24 border border-border rounded-md p-1 overflow-hidden",
                            date.toDateString() === new Date().toDateString() && "bg-accent",
                            date.toDateString() === selectedDate.toDateString() && "ring-2 ring-primary"
                          )}
                          onClick={() => setSelectedDate(date)}
                        >
                          <div className="font-semibold text-sm">{i + 1}</div>
                          {wholeDayEvents.length > 0 && (
                            <div className="bg-primary text-primary-foreground text-xs px-1 my-1 rounded truncate">
                              {wholeDayEvents.length} all-day
                            </div>
                          )}
                          {timedEvents.slice(0, 2).map((event, index) => (
                            <div
                              key={event.id}
                              className={cn(
                                "text-xs truncate rounded px-1 my-1",
                                index % 2 === 0 ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedEvent(event)
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {timedEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground truncate">
                              +{timedEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="day">
                  {eventsForSelectedDate.filter(event => event.isWholeDay).length > 0 && (
                    <div className="mb-6 bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold mb-2 text-muted-foreground">Whole Day Events:</h3>
                      <div className="space-y-2">
                        {eventsForSelectedDate.filter(event => event.isWholeDay).map(event => (
                          <div
                            key={event.id}
                            className="bg-primary text-primary-foreground rounded-md p-2 cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-1">
                    {hours.map((hour) => {
                      const  hourEvents = eventsForSelectedDate.filter(
                        event => !event.isWholeDay && 
                        parseInt(event.startTime.split(':')[0]) === hour
                      )
                      return (
                        <div key={hour} className="flex items-center">
                          <div className="w-16 text-sm text-muted-foreground">
                            {hour.toString().padStart(2, '0')}:00
                          </div>
                          <div className="flex-1 min-h-[2rem] border-l pl-2">
                            {hourEvents.map(event => (
                              <div
                                key={event.id}
                                className="bg-primary text-primary-foreground rounded-md p-2 mb-1 cursor-pointer"
                                onClick={() => setSelectedEvent(event)}
                              >
                                {event.title} ({event.startTime} - {event.endTime})
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
      {selectedEvent && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">{selectedEvent.title}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                </div>
                {!selectedEvent.isWholeDay && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                  </div>
                )}
                {selectedEvent.isWholeDay && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Whole day event</span>
                  </div>
                )}
                <p className="text-sm">{selectedEvent.description}</p>
              </div>
              <Button
                variant="destructive"
                className="w-full mt-6"
                onClick={() => {
                  removeEvent(selectedEvent.id)
                  setSelectedEvent(null)
                }}
              >
                Delete Event
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}