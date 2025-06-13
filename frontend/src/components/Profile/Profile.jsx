import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';
import { FaHeart } from 'react-icons/fa';
import noblogs from '../../assets/noblogs.png';

const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState(null);
  const [oneLiner, setOneLiner] = useState(null);
  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const backendApi = import.meta.env.VITE_BACKEND_API;


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setUser(currentUser);

      const fetchProfile = async () =>{ 
        
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.photoURL) setProfileImage(data.photoURL);
          setName(data.name);
          if (data.oneLiner) setOneLiner(data.oneLiner);
          if (data.bio) setBio(data.bio);
        }
      };

      const fetchBlogs = async () =>{
        try{
          const token = await currentUser.getIdToken()
          const res = await fetch(`${backendApi}/userblogs/${currentUser.uid}`,{
            headers:{
              Authorization:`Bearer ${token}`,
            },
          });

          const data = await res.json();
          const formattedBlogs = data.map(blog => {
            if (blog.createdAt && blog.createdAt._seconds) {
                 blog.createdDate = new Date(blog.createdAt._seconds * 1000);
            } else {
              blog.createdDate = null;
            }
            return blog;
          });

          setBlogs(formattedBlogs);
          }catch (err) {
            console.error('Error fetching blogs:', err);
          }finally {
        setBlogLoading(false);
        }
      };

      setLoading(true);
      await Promise.all([fetchProfile(),fetchBlogs()]);
      setLoading(false);  
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleEdit = () => {
    navigate('/edit-profile');
  };

  const handleWrite = () => {
    navigate('/write-story');
  };

  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };


  return (
    <div className={styles.wrapper}>
      {loading && <div className={styles.spinner}></div>}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/home" className={styles.logoName}>Verbio</Link>
        </div>
        <div className={styles.navButtons}>
          <button className={styles.btn} onClick={handleSignOut}>Signout</button>
        </div>
      </nav>
      <div className={styles.contentWrapper}>
        <div className={styles.profileSection}>
          <div className={styles.profilePic}>
            {profileImage ? (
              <img src={profileImage} alt="" className={styles.actualPic} />
            ) : (
              <div className={styles.profileIcon}>
                <div className={styles.head}></div>
                <div className={styles.body}></div>
              </div>
            )}
          </div>
          {name && <div className={styles.userName}>{name}</div>}
          <div className={styles.oneliner}>
            {oneLiner ? oneLiner : 'Documenting thoughts with purpose.'}
          </div>
          <div className={styles.bioDiv}>
            <div className={styles.bioHeading}>Bio</div>
            <div className={styles.bio}>
              {bio ? bio : 'Sharing thoughts and stories on Verbio — where ideas find their voice. Stay curious, stay inspired.'}
            </div>
          </div>
          <div className={styles.buttonDiv}>
            <button className={styles.btn} onClick={handleWrite}>Write</button>
            <button className={styles.btn} onClick={handleEdit}>Edit Profile</button>
          </div>
        </div>
        <div className={styles.verticalLine}></div>
        <div className={styles.blogSection}>
            {blogLoading?(
              <div>Loading Blogs...</div>
            ):(
              blogs.length > 0?(
                blogs.map((blog,index) => (
                  <Link to={`/blog/${blog.id}`}
                    key={blog.id}
                    style={{ textDecoration: 'none',color:'inherit' }}
                  >
                  <div key={index} className={styles.eachBlog}>
                    <div className={styles.blogTitle}>{blog.title}</div>
                    <div className={styles.secondLine}>
                      <div className={styles.dateSection}>
                          <div className={styles.date}>
                              {blog.createdDate && blog.createdDate.toLocaleDateString('en-US', {
                                  year  : 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                               })}
                          </div>                      
                      </div>
                      <div className={styles.likeSection}>
                        <FaHeart className={styles.likedHeart} />
                        <div className={styles.likeCount}>{blog.likes}</div>
                      </div>
                    </div>
                    <div className={styles.blogContent}>{stripHtml(blog.content)?.split(' ').slice(0, 18).join(' ')}...</div>
                  </div>
                  </Link>
                ))
              ):(
                <div className={styles.noBlog}>
                  <img src={noblogs} alt="" className={styles.noBlogsimg} />
                  <div className={styles.noBlogContent}>No Blogs to show...Write something!</div>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
