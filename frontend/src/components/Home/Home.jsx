import {React,useState,useEffect} from 'react'
import styles from './Home.module.css'
import { Link, useNavigate } from "react-router-dom"
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';
import person from '../../assets/person.png'
import write from '../../assets/write.png'
import { FaHeart } from 'react-icons/fa'
import loadingImg from '../../assets/loading.webp'

const Home = () => {

    const navigate = useNavigate()
    const auth = getAuth(app);
    const [user,setUser] = useState(null);
    const [photo,setPhoto] = useState(null);
    const [name,setName] = useState(null);
    const [loading,setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [blogLoading, setBlogLoading] = useState(true);
    const backendApi = import.meta.env.VITE_BACKEND_API;
    const handleToProfile = () => {
        navigate('/profile');
    };

    const handleWrite = () =>{
    navigate('/write-story');
    }

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setUser(currentUser);

      const fetchProfile = async () =>{ 
        
      const userDocRef = doc(db,'users',currentUser.uid);
        const userDoc = await getDoc(userDocRef);
          if(userDoc.exists()){
            const data = userDoc.data();
              if(data.photoURL){
                setPhoto(data.photoURL);
                  }
                setName(data.name);
              }
          };

      const fetchBlogs = async () =>{
        try{
          const res = await fetch(`${backendApi}/allblogs/`);

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

  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <div className={styles.mainDiv}>
      {loading && <div className={styles.spinner}></div>}
      <nav className={styles.navbar}>
        <div className={styles.logo}>Verbio</div>
          <div className={styles.navButtons}>
            <div className={styles.writeIconDiv}>
              <img src={write} alt="write" className={styles.writeIcon} onClick={handleWrite}/>
            </div>
            <div className={styles.profile} onClick={handleToProfile}>
              <div className={styles.profileIconDiv}>
                  <img src={person} alt="profile" className={styles.profileIcon} />
              </div>
            <div className={styles.userName}>{name}</div>
          </div>
        </div>
      </nav>
      <div className={styles.firstHeading}>Suggested for you!</div>
      <div className={styles.contentDiv}>
      <div className={styles.blogSection}>
        {blogLoading?(
          <div className={styles.loadingDiv}>
            <img src={loadingImg} alt="" className={styles.loadingImg} />
          </div>
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
                          <div className={styles.nameAndDate}>
                            <div className={styles.authorName}>{blog.authorName}</div>
                            <div className={styles.dateSection}>
                                <div className={styles.date}>
                                    {blog.createdDate && blog.createdDate.toLocaleDateString('en-US', {
                                        year  : 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                     })}
                                </div>                      
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
                <div>No blogs to show...</div>
              )
            )}
        </div>
        </div>
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
  )
}

export default Home
