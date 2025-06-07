import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Signup.module.css'
import googleIcon from '../../assets/googleIcon.webp'

const Signup = () => {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate('/login')
  }

  return (
    <div className={styles.mainDiv}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoName}>Verbio</Link>
        </div>
        <div className={styles.navButtons}>
          <button className={styles.navbtn} onClick={handleLoginClick}>Login</button>
        </div>
      </nav>
      <div className={styles.signupSection}>
        <div className={styles.brand}>Verbio</div>
        <div className={styles.signUp}>Create Account</div>
        <div className={styles.inputs}>
          <input type="text" placeholder="Name" />
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
        </div>
        <div className={styles.btnDiv}>
          <button className={styles.btn}>Sign up</button>
        </div>
        <div className={styles.google}>
          <img src={googleIcon} alt="Google" className={styles.googleIcon} />
          <div className={styles.googleText}>Continue with Google</div>
        </div>
        <div className={styles.tologin}>Already have an account?
            <Link to="/login"> Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
