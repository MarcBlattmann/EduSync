"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Mail, Lock, User, ArrowLeft, Sun, Moon } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Progress } from "@/components/ui/progress"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  terms: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions.",
  }),
})

export default function RegistrationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
    mode: "onChange",
  })

  useEffect(() => {
    const values = form.getValues()
    const filledFields = Object.values(values).filter(Boolean).length
    setFormProgress((filledFields / Object.keys(values).length) * 100)
  }, [form.watch()])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      console.log(values)
      // Registration successful, but we're not showing a success banner anymore
    }, 2000)
  }

  function handleGoogleLogin() {
    // Implement Google login logic here
    console.log("Google login clicked")
  }

  function handleBack() {
    // Implement back navigation logic here
    console.log("Back button clicked")
  }

  if (!mounted) return null

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-background dark:via-background/50 dark:to-background p-4">
      <Card className="w-full max-w-xl shadow-lg relative">
        <Button
          variant="ghost"
          className="absolute left-4 top-4 p-2"
          onClick={handleBack}
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="absolute right-4 top-4 p-2"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <CardHeader className="space-y-1 text-center pt-12">
          <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
          <p className="text-muted-foreground">Enter your information to get started</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Form Progress</span>
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
            <span>Sign up with Google</span>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground dark:text-foreground">Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="John Doe" {...field} className="pl-10 py-2 text-black dark:text-white placeholder:text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage className="dark:text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground dark:text-foreground">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input type="email" placeholder="john@example.com" {...field} className="pl-10 py-2 text-black dark:text-white placeholder:text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage className="dark:text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground dark:text-foreground">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" {...field} className="pl-10 py-2 text-black dark:text-white placeholder:text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage className="dark:text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-input">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="terms"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none flex-1">
                      <FormLabel
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-foreground dark:text-foreground"
                      >
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                          terms of service
                        </a>
                      </FormLabel>
                      <FormMessage className="dark:text-red-500" />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full py-2 text-base" disabled={isLoading || !form.formState.isValid}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 items-center">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Sign in
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}