"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Mail, Lock, ArrowLeft, Sun, Moon, AlertCircle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Progress } from "@/components/ui/progress"

import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth"

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

const formSchema = z.object({
  email: z.string().email({
    message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  }),
  password: z.string().min(8, {
    message: "Das Passwort muss mindestens 8 Zeichen lang sein.",
  }),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Überprüfen Sie den Authentifizierungsstatus beim Laden der Seite
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Benutzer ist bereits eingeloggt, leiten Sie ihn zur App-Seite weiter
        router.push('./app')
      }
    })

    // Cleanup-Funktion
    return () => unsubscribe()
  }, [router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    const values = form.getValues()
    const filledFields = Object.values(values).filter(Boolean).length
    setFormProgress((filledFields / Object.keys(values).length) * 100)
  }, [form.watch()])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      setFeedbackMessage({ type: 'success', message: "Anmeldung erfolgreich! Sie werden weitergeleitet..." })
      setTimeout(() => router.push('./app'), 2000)
    } catch (error) {
      console.error("Anmeldefehler:", error)
      setFeedbackMessage({ type: 'error', message: "Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten und versuchen Sie es erneut." })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      setFeedbackMessage({ type: 'success', message: "Google-Anmeldung erfolgreich! Sie werden weitergeleitet..." })
      setTimeout(() => router.push('./app'), 2000)
    } catch (error) {
      console.error("Google-Anmeldefehler:", error)
      setFeedbackMessage({ type: 'error', message: "Google-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut." })
    }
  }

  if (!mounted) return null

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-background dark:via-background/50 dark:to-background p-4">
      <Card className="w-full max-w-xl shadow-lg relative">
        <Link href="./">
          <Button
            variant="ghost"
            className="absolute left-4 top-4 p-2"
            aria-label="Zurück"
          >
          <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="absolute right-4 top-4 p-2"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Theme umschalten"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <CardHeader className="space-y-1 text-center pt-12">
          <CardTitle className="text-3xl font-bold">Anmelden</CardTitle>
          <p className="text-muted-foreground">Geben Sie Ihre Anmeldedaten ein, um auf Ihr Konto zuzugreifen</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {feedbackMessage && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-md flex items-center space-x-2 ${
                  feedbackMessage.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                }`}
              >
                {feedbackMessage.type === 'success' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span>{feedbackMessage.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Formularfortschritt</span>
              <span>{Math.round(formProgress)}%</span>
            </div>
            <Progress value={formProgress} className="w-full" />
          </div>
          <Button
            variant="outline"
            className="w-full py-2 text-base flex items-center justify-center space-x-2"
            onClick={handleGoogleLogin}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Mit Google anmelden</span>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Oder fortfahren mit</span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground dark:text-foreground">E-Mail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input type="email" placeholder="max@beispiel.de" {...field} className="pl-10 py-2 text-black dark:text-white placeholder:text-muted-foreground" />
                        </div>
                      </FormControl>
                      <AnimatePresence mode="wait">
                        {form.formState.errors.email && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FormMessage className="dark:text-red-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground dark:text-foreground">Passwort</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" {...field} className="pl-10 py-2 text-black dark:text-white placeholder:text-muted-foreground" />
                        </div>
                      </FormControl>
                      <AnimatePresence mode="wait">
                        {form.formState.errors.password && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FormMessage className="dark:text-red-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full py-2 text-base" disabled={isLoading || !form.formState.isValid}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Bitte warten
                  </>
                ) : (
                  "Anmelden"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 items-center">
          <div className="text-center text-sm text-muted-foreground">
            Noch kein Konto?{" "}
            <Link href="./register" className="text-primary hover:underline font-medium">
              Registrieren
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}