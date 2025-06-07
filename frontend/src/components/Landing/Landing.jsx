import React from 'react'
import styles from './Landing.module.css'

const Landing = () => {
  return (
    <div className={styles.wrapper}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Verbio</div>
        <div className={styles.navButtons}>
          <button className={styles.signIn}>Sign in</button>
          <button className={styles.getStarted}>Get Started</button>
        </div>
      </nav>
      <div className={styles.content}>
        <div className={styles.heading}>
          The art of <br />blog writing
        </div>
        <div className={styles.subHeading}>
          Express your ideas an share <br />your stories with the world
        </div>
        <div className={styles.buttonDiv}>
          <button className={styles.getStarted}>Get Started</button>
        </div>
        <div className={styles.semiCircle}></div>
      </div>
    </div>
  )
}

export default Landing
