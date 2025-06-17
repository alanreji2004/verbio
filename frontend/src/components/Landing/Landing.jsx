import {React,useState,useEffect} from 'react'
import styles from './Landing.module.css'
import { Link, useNavigate } from "react-router-dom"
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';
import person from '../../assets/person.png'

const Landing = () => {
    const navigate = useNavigate()
    const auth = getAuth(app);
    const [user,setUser] = useState(null);
    const [photo,setPhoto] = useState(null);
    const [name,setName] = useState(null);
    const [loading,setLoading] = useState(false);

    const handleGetStarted = () => {
        navigate('/home');
    }

    const handleToProfile = () => {
        navigate('/profile');
    };
    useEffect(() =>{
        setLoading(true);
        const unsubscribe = onAuthStateChanged(auth,async(currentUser)=>{
            if(currentUser){
                setUser(currentUser);
                const userDocRef = doc(db,'users',currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if(userDoc.exists()){
                    const data = userDoc.data();
                    if(data.photoURL){
                        setPhoto(data.photoURL);
                    }
                    setName(data.name);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    },[auth,navigate]);


  return (
    <div className={styles.wrapper}>
    {loading && <div className={styles.spinner}></div>}
      <nav className={styles.navbar}>
        <div className={styles.logo}>Verbio</div>
        <div className={styles.navButtons}>
            {user?<div className={styles.profile} onClick={handleToProfile}>
                <div className={styles.profileIconDiv}>
                    <img src={person} alt="" className={styles.profileIcon} />
                    </div>
                <div className={styles.userName}>{name}</div>
            </div>
         : <Link to="/login" className={styles.signIn}>Sign in</Link>
        }   
          {/* <button className={styles.getStarted} onClick={handleGetStarted}>Get Started</button> */}
        </div>
      </nav>
      <div className={styles.content}>
        <div className={styles.heading}>
          The art of <br />blog writing
        </div>
        <div className={styles.subHeading}>
          Express your ideas and share <br />your stories with the world
        </div>
        <div className={styles.buttonDiv}>
          <button className={styles.getStarted} onClick={handleGetStarted}>Get Started</button>
        </div>
        <div className={styles.semiCircle}></div>
        <div className={styles.notes}>
            <div className={styles.line1}></div>
            <div className={styles.line2}></div>
            <div className={styles.line3}></div>
        </div>
        <div className={styles.rectangle}>
            <div className={styles.innerRectangle}></div>
        </div>
        <div className={styles.square}></div>
        <div className={styles.oval}></div>
      </div>
    </div>
  )
}

export default Landing