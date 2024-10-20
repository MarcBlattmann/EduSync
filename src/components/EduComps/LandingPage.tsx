'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Rocket, Brain, Target, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { ref, push } from "firebase/database"

export default function LandingPage({database, app}) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Save email to Firebase Realtime Database
      const waitlistRef = ref(database, 'waitlist')
      await push(waitlistRef, { email, timestamp: Date.now() })
      console.log('Email saved to waitlist:', email)
      setIsSubmitted(true)
      setEmail('') // Clear the email input after successful submission
    } catch (error) {
      console.error('Error saving email to waitlist:', error)
      // You might want to show an error message to the user here
    }
  }

  useEffect(() => {
    // Preload images
    const images = [
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400'
    ]
    images.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center order-first lg:order-last"
              >
                <div className="relative w-full max-w-sm lg:max-w-lg">
                  <div className="absolute top-0 -left-4 w-36 h-36 sm:w-72 sm:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute top-0 -right-4 w-36 h-36 sm:w-72 sm:h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-36 h-36 sm:w-72 sm:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                  <div className="relative">
                    <BookOpen className="h-32 w-32 sm:h-64 sm:w-64 text-primary mx-auto" />
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col justify-center space-y-4"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    EduSync: The Future of Learning
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground text-sm sm:text-base md:text-xl">
                    Get ready to revolutionize your education. Join our waitlist and be the first to experience seamless learning when we launch.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  {["Personalized learning paths", "Interactive study materials", "Real-time progress tracking"].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-sm"
                >
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input 
                      className="flex-1" 
                      placeholder="Enter your email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full sm:w-auto">Join Waitlist</Button>
                  </form>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    Be among the first to know when EduSync launches!
                  </p>
                </motion.div>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 font-semibold text-sm sm:text-base"
                  >
                    Thank you for joining our waitlist!
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50 dark:bg-secondary-foreground/5">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 sm:mb-12">
              How EduSync Will Transform Your Learning
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Rocket, title: "Accelerated Progress", content: "Boost your learning speed with personalized study plans and adaptive quizzes tailored to your pace and style." },
                { icon: Brain, title: "Enhanced Understanding", content: "Deepen your comprehension through interactive content, peer discussions, and expert-led live sessions." },
                { icon: Target, title: "Goal Achievement", content: "Stay motivated and on track with clear milestones, progress tracking, and celebratory achievements." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-background/50 backdrop-blur-sm border-primary/10">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg sm:text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm sm:text-base text-muted-foreground">{item.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Be the First to Experience EduSync
                </h2>
                <p className="max-w-[600px] text-muted-foreground text-sm sm:text-base md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Don't miss out on the opportunity to revolutionize your learning journey. Join our waitlist today!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input 
                    className="flex-1" 
                    placeholder="Enter your email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full sm:w-auto">Join Waitlist</Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  By joining, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-primary" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-600 font-semibold text-sm sm:text-base"
                >
                  Thank you for joining our waitlist!
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 EduSync. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}