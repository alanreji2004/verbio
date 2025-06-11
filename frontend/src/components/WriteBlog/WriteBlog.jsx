import {React, useState, useEffect, use} from 'react'
import styles from './WriteBlog.module.css'
import { Link, useNavigate } from "react-router-dom"
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';
import person from '../../assets/person.png'
import publish from '../../assets/publish.png'
import axios from 'axios';


const WriteBlog = () => {

    const navigate = useNavigate()
    const auth = getAuth(app);
    const [user,setUser] = useState(null);
    const [photo,setPhoto] = useState(null);
    const [name,setName] = useState(null);
    const [loading,setLoading] = useState(false);
    const [titleText,setTitleText] = useState('');
    const [bodyText,setBodyText] = useState('');
    const [isDirty,setIsDirty] = useState(false);


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
              }else{
                navigate('/login');
              }
            setLoading(false);
        });
        return () => unsubscribe();
    },[auth,navigate]);

  const handlePublish = async () =>{
    if(!titleText.trim() || !bodyText.trim() ||loading){
      return;
    }
    setLoading(true);
    try{
      const idToken = await user.getIdToken();
      const backendApi = import.meta.env.VITE_BACKEND_API;

      const res = await axios.post(
        `${backendApi}/blogs`,
        {
          title: titleText,
          content: bodyText,
        },
        {
          headers:{
            'content-type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
        }
      );
      if(res.status === 201){
        alert('Blog published');
            setTitleText('');
            setBodyText('');
            setIsDirty(false);
            document.querySelector(`.${styles.titleContent}`).innerText = '';
            document.querySelector(`.${styles.bodyContent}`).innerText = '';
      }
    }catch(error){
      console.error('Error publishing blog:');
      alert('Failed to publish blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainDiv}>
    {loading && <div className={styles.spinner}></div>}
      <nav className={styles.navbar}>
        <div className={styles.logo}>Verbio</div>
          <div className={styles.navButtons}>
            <div className={styles.profile} onClick={handleToProfile}>
              <div className={styles.profileIconDiv}>
                  <img src={person} alt="profile" className={styles.profileIcon} />
              </div>
            <div className={styles.userName}>{name}</div>
          </div>
        </div>
        </nav>
        <div className={`${styles.publishDiv} ${!(titleText.trim() || bodyText.trim()) ? styles.disabledPublish : ''}`}
          onClick={handlePublish}
        >
            <div className={styles.publishIconDiv}>
                <img src={publish} alt="publish" className={styles.publishIcon}/>
            </div>
            <div className={styles.publishText}>Publish</div>
        </div>
        <div className={styles.content}>
            <div 
            className={styles.titleContent} 
            contentEditable = "true" 
            data-placeholder="Title"
            onInput={(e) => {
              const text = e.currentTarget.textContent.trim();
              if(!text){
                e.currentTarget.innerHTML = '';
              }
              setTitleText(text);
              setIsDirty(true);
            }} >
            </div>
            <div 
            className={styles.bodyContent} 
            contentEditable = "true" 
            data-placeholder = "Write your Blog..."
            onInput={(e) => {
              const content = e.currentTarget.textContent.trim();
              if(!content){
                e.currentTarget.innerHTML = '';
              }
              setBodyText(content);
              setIsDirty(true);
              }}>
            </div>
        </div>
    </div>
  )
}

export default WriteBlog
