// https://github.com/MnarcBlattmann/EduSync/wiki/Code#pagejs

"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

export default function Home() {
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        location.href = "./App"; // Redirect to app if logged in
      } else {
        location.href = "/LandingPage"; // Redirect to Landing page if not logged in
      }
    }
  }, [user, isLoading]);

  // Shows feedback to the user while the authentication is in progress.
  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    //It shows redirecting in the case that the internet connection is slow.
    <div>Redirecting...</div>
  );
}
