// @ts-nocheck

'use client';

import { FormEvent, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInAction } from '@/app/actions';
import { useSnackbar } from '@/context/SnackbarContext';
import logoblack from '@/assets/logos/logo-black.svg';
import googleIcon from '@/assets/icons/google.svg';
import './page.css';

// Separate component for the parts that need searchParams
function SignInForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      setLoading(true);
      const result = await signInAction(formData);
      if (result?.error) {
        showSnackbar(result.error, 'error');
      } else {
        showSnackbar('Successfully signed in!', 'success');
        const callbackUrl = searchParams.get('callbackUrl') || '/protected';
        router.push(callbackUrl);
      }
    } catch (error: any) {
      showSnackbar(error.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="input"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="input"
      />
      <div className="mini-menu-container">
        <span>Remember me</span>
        <span>Forgot password?</span>
      </div>
      <button 
        type="submit" 
        className="login-button main"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
      <button type="button" className="login-button secondary">
        <Image src={googleIcon} alt="Google icon" width={24} height={24} />
        Sign in with Google
      </button>
    </form>
  );
}

// Main component
export default function SignIn() {
  return (
    <main className="main-container">
      <div className="illustration-container">
        {/* Illustration content */}
      </div>
      <div className="login-container">
        <Image src={logoblack} alt="logo" className="logo" priority />
        <h1 className="title">Welcome Back!</h1>
        <span className="subtitle">Please enter your details.</span>
        <Suspense fallback={<div>Loading...</div>}>
          <SignInForm />
        </Suspense>
        <div className="dont-have-a-acount-button">
          Don&apos;t have an account? <Link href="/sign-up"><span>Sign up</span></Link>
        </div>
      </div>
    </main>
  );
}