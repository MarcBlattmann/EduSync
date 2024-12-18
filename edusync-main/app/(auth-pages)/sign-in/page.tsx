"use client";

import { signInAction } from "@/app/actions";
import logoblack from "@/assets/logos/logo-black.svg";
import GoogleLogo from "@/assets/logos/google-logo.svg";
import Link from "next/link";
import Image from 'next/image';
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSnackbar } from '@/context/SnackbarContext';
import "./page.css";

export default function Login() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const success = searchParams.get('success');
    
    const timeoutId = setTimeout(() => {
      if (error) {
        showSnackbar(error, 'error');
      } else if (success) {
        showSnackbar(success, 'success');
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [searchParams, showSnackbar]); // Add searchParams to dependency array

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
      if (error) {
        showSnackbar(error.message, 'error');
      }
    } catch (err: any) {
      showSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      const result = await signInAction(formData);
      if (result?.error) {
        showSnackbar(result.error, 'error');
      } else {
        showSnackbar('Successfully signed in!', 'success');
        router.push('/app');
      }
    } catch (err: any) {
      showSnackbar(err.message, 'error');
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

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleEmailSubmit(formData);
        }}>
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

        <div className="dont-have-a-acount-button">
          Don't have an account? <Link href="/sign-up"><span>Sign up</span></Link>
        </div>
      </div>
    </div>
  );
}