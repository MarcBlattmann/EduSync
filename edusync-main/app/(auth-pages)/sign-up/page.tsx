'use client';

import { FormEvent, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signUpAction } from '@/app/actions';
import { useSnackbar } from '@/context/SnackbarContext';
import logoblack from '@/assets/logos/logo-black.svg';
import './page.css';

// Separate component for the form that uses searchParams
function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      setLoading(true);
      const result = await signUpAction(formData);
      if (result?.error) {
        showSnackbar(result.error, 'error');
      } else {
        showSnackbar('Successfully signed up!', 'success');
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
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        required
        className="input"
      />
      <button 
        type="submit" 
        className="login-button main"
        disabled={loading}
      >
        {loading ? 'Signing up...' : 'Sign up'}
      </button>
    </form>
  );
}

// Main component
export default function SignUp() {
  return (
    <main className="main-container">
      <div className="illustration-container">
        {/* Illustration content */}
      </div>
      <div className="login-container">
        <Image src={logoblack} alt="logo" className="logo" priority />
        <h1 className="title">Welcome!</h1>
        <span className="subtitle">Please enter your details.</span>
        <Suspense fallback={<div>Loading...</div>}>
          <SignUpForm />
        </Suspense>
        <div className="dont-have-a-acount-button">
          Already have an account? <Link href="/sign-in"><span>Sign in</span></Link>
        </div>
      </div>
    </main>
  );
}