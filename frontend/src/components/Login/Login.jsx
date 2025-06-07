import {React,useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import styles from './Login.module.css'
import googleIcon from '../../assets/googleIcon.webp'
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const signInWithGoogle = async () =>{
        try{
            setError(null);
            setLoading(true);

            const userCredential = await signInWithPopup(auth,provider);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                lastLogin: new Date(),
                },{ merge: true });
            navigate('/home');
        }
        catch(error){
            console.log(error.message);
            setError("Sign in Failed,Try again..")
        }
        finally{
            setLoading(false);
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
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
        </div>
        <div className={styles.btnDiv}>
          <button className={styles.btn}>Sign in</button>
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
        <div className={styles.forgot}>Forgot Password?</div>
        <div className={styles.tosignup}>Don't have an account?
            <Link to="/signup"> Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
