import {React,useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Signup.module.css'
import googleIcon from '../../assets/googleIcon.webp'
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import {createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, app, storage } from '../../firebase';


const Signup = () => {
    const navigate = useNavigate()

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingEmail,setLoadingEmail] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginClick = () => {
    navigate('/login')
    }

    const signUpWithGoogle = async () => {
    try {
        setError(null);
        setLoading(true);

        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt : new Date(),
        lastLogin: new Date(),
        },{ merge: true });

        navigate('/home');
    } catch (error) {
        console.error(error.message);
        setError('Something Went Wrong...Try again!');
    }finally{
        setLoading(false);
    }
  };

  const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

  const signUpWithEmail = async () =>{
    try{
        setError(null);
        setLoadingEmail(true);

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            setLoadingEmail(false);
            return;
        }

        if (!name.trim()) {
            setError("Please enter your name.");
            setLoadingEmail(false);
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth,email,password);
        const user = userCredential.user;


        await  sendEmailVerification(user);
        navigate('/verify-email', {
            state: {
            uid: user.uid,
            name: name,
            email: user.email,
        }
    });

    }catch (error) {
        console.error(error.message);
        if (error.code === 'auth/email-already-in-use') {
            setError('Email is already in use.');
        }
        else if (error.code === 'auth/weak-password') {
            setError('Password should be at least 6 characters.');
        }  
        else if(error.code === 'auth/account-exists-with-different-credential'){
            setError('Email id already in use with different credential.')
        }
        else {
            setError('Signup failed. Please try again.');
        }
        } finally {
            setLoadingEmail(false);
        }
  };

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
          <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
          <input type="text" placeholder="Email" value={email} onChange = {(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className={styles.btnDiv}>
          <button className={styles.btn} onClick={signUpWithEmail} disabled={loading}>
                {loadingEmail ? 'Signing you up...' : 'Sign up'}
        </button>
        </div>
        <div className={styles.google}>
          <img src={googleIcon} alt="Google" className={styles.googleIcon} />
          <div className={styles.googleText} onClick={signUpWithGoogle} disabled={loading} >
            {loading ? 'Signing you up...': "Continue with Google"}
          </div>
        </div>
        
        {error && (
          <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
            {error}
          </p>
        )}

        <div className={styles.tologin}>Already have an account?
            <Link to="/login"> Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
