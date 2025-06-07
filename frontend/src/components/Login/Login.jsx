import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Login.module.css'
import googleIcon from '../../assets/googleIcon.webp'

const Login = () => {
  return (
    <div className={styles.mainDiv}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoName}>Verbio</Link>
        </div>
        <div className={styles.navButtons}>
          <button className={styles.navbtn}>SignUp</button>
        </div>
      </nav>
      <div className={styles.loginSection}>
        <div className={styles.brand}>Verbio</div>
        <div className={styles.signIn}>Sign in</div>
        <div className={styles.inputs}>
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
        </div>
        <div className={styles.btnDiv}>
          <button className={styles.btn}>Sign in</button>
        </div>
        <div className={styles.google}>
          <img src={googleIcon} alt="Google" className={styles.googleIcon} />
          <div className={styles.googleText}>Continue with Google</div>
        </div>
        <div className={styles.forgot}>Forgot Password?</div>
        <div className={styles.tosignup}>Don't have an account? Sign up</div>
      </div>
    </div>
  )
}

export default Login
