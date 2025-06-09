import {React,useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import styles from './Login.module.css'
import googleIcon from '../../assets/googleIcon.webp'
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, app, storage } from '../../firebase';

const Login = () => {
    const navigate = useNavigate()
    const handleSignupClick = () => {
        navigate('/signup')
    }

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const [error,setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [emailLoading,setEmailLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');

    const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user
      const userDocRef = doc(db, "users", user.uid)
      const userDocSnap = await getDoc(userDocRef)
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date()
        })
      } else {
        await setDoc(userDocRef, {
          lastLogin: new Date()
        }, { merge: true })
      }
      navigate('/profile')
    } catch (error) {
      setError("Sign in Failed, Try again..")
    } finally {
      setLoading(false)
    }
  }

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const signInWithEmail = async () =>{
        try{
            setError(null);
            setEmailLoading(true);

            if (!isValidEmail(email)) {
                setError("Please enter a valid email address.");
                setEmailLoading(false);
                return;
            }

            const userCredential = await signInWithEmailAndPassword(auth,email,password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                lastLogin: new Date(),
            }, { merge: true });


            navigate('/profile');
        }
        catch(error){
            console.error(error.code, error.message);
            if (error.code === "auth/user-not-found") {
                setError("No user found with this email.");
            } else if (error.code === "auth/wrong-password") {
                setError("Incorrect password.");
            } else if (error.code === "auth/invalid-credential") {
                setError("Invalid credentials. Please check your email and password.");
            } else {
                setError("Login failed. Please try again.");
            }
        }
        finally{
            setEmailLoading(false);
        }
    };

  return (
    <div className={styles.mainDiv}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoName}>Verbio</Link>
        </div>
        <div className={styles.navButtons}>
          <button className={styles.navbtn} onClick={handleSignupClick}>SignUp</button>
        </div>
      </nav>
      <div className={styles.loginSection}>
        <div className={styles.brand}>Verbio</div>
        <div className={styles.signIn}>Sign in</div>
        <div className={styles.inputs}>
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}  />
          <input type="password" placeholder="Password"  value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className={styles.btnDiv}>
          <button className={styles.btn} onClick={signInWithEmail} disabled={emailLoading}>
            {emailLoading ? 'Signing you in..' : "Sign In"}
          </button>
        </div>
        <div className={styles.google}>
          <img src={googleIcon} alt="Google" className={styles.googleIcon} />
          <div className={styles.googleText} onClick={signInWithGoogle} disabled={loading}>
            {loading ? 'Signing you up...': "Continue with Google"}
          </div>
        </div>
        {error && (
          <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
            {error}
          </p>
        )}
        <div className={styles.forgot}>
          <Link to="/reset-password">Forgot Password?</Link>
        </div>
        <div className={styles.tosignup}>Don't have an account?
            <Link to="/signup"> Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
