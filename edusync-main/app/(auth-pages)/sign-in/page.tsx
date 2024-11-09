"use client";

import { signInAction } from "@/app/actions";
import logoblack from "@/assets/logos/logo-black.svg";
import GoogleLogo from "@/assets/logos/google-logo.svg";
import Link from "next/link";
import Image from 'next/image';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import "./page.css";

export default function Login({ searchParams }: { searchParams: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/app`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/app');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="illustration-container"></div>
      <div className="login-container">
        <Image 
          src={logoblack} 
          alt="logo"
          className="logo"
        />
        <h1 className="title">Welcome back!</h1>
        <h4 className="subtitle">Please enter your details</h4>

        <form action={handleEmailSubmit}>
          <input 
            type="email" 
            required 
            name="email" 
            placeholder="Email" 
            className="input"
            disabled={loading}
          />
          <input 
            type="password" 
            required 
            name="password" 
            placeholder="Password" 
            className="input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="login-button main"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <button 
          type="button" 
          className="login-button secondary" 
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <Image alt="Google Logo" src={GoogleLogo} /> 
          {loading ? 'Connecting...' : 'Login with Google'}
        </button>

        {error && <div className="error-message">{error}</div>}

        <div className="dont-have-a-acount-button">
          Don't have an account? <Link href="/signup"><span>Sign up</span></Link>
        </div>
      </div>
    </div>
  );
}