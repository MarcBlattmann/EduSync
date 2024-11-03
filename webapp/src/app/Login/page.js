
import "./page.css";
import Image from "next/image";
import logo from "../Assets/Logos/logo-black.svg"
import GoogleLogo from "../Assets/Logos/google-logo.svg"

export default function Login() {
    return (
      <div className="main-container">
          <div className="illustration-container"></div>
          <div className="login-container">
              <Image 
                  src={logo} 
                  alt="logo"
                  className="logo"
              />
              <h1 className="title">Welcome back!</h1>
              <h4 className="subtitle">Please enter your details</h4>
              <input type="text" placeholder="Email" className="input"/>
              <input type="password" placeholder="Password" className="input"/>
              <div className="mini-menu-container">
                <div className="remember-me">
                  <input type="checkbox"/>
                  Remember me ?
                </div>
                <div className="forgot-password">Forgot password?</div>
              </div>
              <div className="login-button main">Login</div>
              <div className="login-button secondary"><Image alt="Google Logo" src={GoogleLogo}/>Login with Google</div>
              <div className="dont-have-a-acount-button">
                Don't have an account? <span>Sign up</span>
              </div>
          </div>
      </div>
    );
  }
  