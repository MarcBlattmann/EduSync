
import Link from 'next/link';
import './LoginButton.css';

export default function LoginButton() {
  return (
    <Link href="/sign-in" className="login-button">
      Login
    </Link>
  );
}