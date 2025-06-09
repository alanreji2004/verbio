import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';

const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.photoURL) {
            setProfileImage(data.photoURL);
          }
          if (data.name) {
            setName(data.name);
          }
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className={styles.mainDiv}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoName}>Verbio</Link>
        </div>
        <div className={styles.navButtons}>
          <button className={styles.navbtn} onClick={handleSignOut}>Signout</button>
        </div>
      </nav>
      <div className={styles.profile}>
        <div className={styles.profilePic}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" className={styles.actualPic} />
          ) : (
            <div className={styles.profileIcon}>
              <div className={styles.head}></div>
              <div className={styles.body}></div>
            </div>
          )}
        </div>
        {name && <div className={styles.userName}>{name}</div>}
      </div>
    </div>
  );
};

export default Profile;
