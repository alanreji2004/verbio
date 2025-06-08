import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth();

  const handleReset = async () => {
    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError("No user found with this email.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className={styles.resetContainer}>
      <h2 className={styles.heading}>Reset Your Password for <br />Verbio</h2>
      {!submitted ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleReset} className={styles.button}>
            Send Reset Email
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </>
      ) : (
        <p className={styles.success}>
          Password reset email sent to <strong>{email}</strong>. Please check your inbox.
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
