import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from '../../firebase'
import styles from './VerifyEmail.module.css'

const VerifyEmail = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { uid, name, email } = state || {};
  const [user, setUser] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        setEmailVerified(true);
        clearInterval(interval);

        const userDocRef = doc(db, "users", uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          await setDoc(userDocRef, {
            name: name,
            email: email,
            createdAt: new Date(),
            lastLogin: new Date()
          });
        }

        navigate('/profile');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [auth, uid, name, email, navigate]);

  const resendEmail = async () => {
    setResending(true);
    try {
      await user?.reload();
      await user?.sendEmailVerification();
    } catch (error) {
      console.error("Error resending verification email:", error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Verify Your Email</h2>
        <p className={styles.subtext}>
          We've sent a verification link to <strong>{email}</strong>. Please check your inbox and verify to continue.
        </p>
        <button className={styles.resend} onClick={resendEmail} disabled={resending}>
          {resending ? 'Resending...' : 'Resend Email'}
        </button>
        <p className={styles.info}>This page will automatically redirect after verification.</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
