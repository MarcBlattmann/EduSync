"use client";

import { FormEvent, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInAction } from '@/app/actions';
import { useSnackbar } from '@/context/SnackbarContext';
import logoblack from '@/assets/logos/logo-black.svg';
import GoogleLogo from '@/assets/logos/google-logo.svg';
import { createClient } from "@/utils/supabase/client";
import './page.css';

// Define the action result type
interface SignInResult {
  error?: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
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

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      setLoading(true);
      // Explicitly type the result
      const result = await signInAction(formData) as SignInResult;
      if (result?.error) {
        showSnackbar(result.error, 'error');
      } else {
        showSnackbar('Successfully signed in!', 'success');
        router.push('/app');
      }
    } catch (error: any) {
      showSnackbar(error.message || 'An error occurred', 'error');
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

        <form onSubmit={handleEmailSubmit}>
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