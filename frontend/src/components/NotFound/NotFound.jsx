import React from 'react'
import styles from './NotFound.module.css'
import notfound from '../../assets/notfound.webp'
const NotFound = () => {
  return (
    <div className={styles.mainDiv}>
      <img src={notfound} alt="" className={styles.image} />
    </div>
  )
}

export default NotFound
