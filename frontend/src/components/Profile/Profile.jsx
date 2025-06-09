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
  const [oneLiner,setOneLiner] = useState(null);
  const [bio,setBio] = useState(null);

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
          setName(data.name);
          if(data.oneLiner){
            setOneLiner(data.oneLiner);
          }
          if(data.bio){
            setBio(data.bio);
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

  const handleEdit = () =>{
    navigate('/edit-profile')
  }

  return (
    <div className={styles.mainDiv}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoName}>Verbio</Link>
        </div>
        <div className={styles.navButtons}>
          <button className={styles.btn} onClick={handleSignOut}>Signout</button>
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
        <div className={styles.oneliner}>
          {oneLiner?{oneliner}:'Documenting thoughts with purpose.'}
        </div>
        <div className={styles.bioDiv}>
          <div className={styles.bioHeading}>Bio</div>
          <div className={styles.bio}>
            {bio?{bio}:'Sharing thoughts and stories on Verbio — where ideas find their voice. Stay curious, stay inspired.'}
          </div>
        </div>
        <div className={styles.buttonDiv}>
          <button className={styles.btn}>Write</button>
          <button className={styles.btn} onClick={handleEdit}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
