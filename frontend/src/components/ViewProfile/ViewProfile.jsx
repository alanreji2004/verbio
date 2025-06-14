import { React, useState, useEffect } from 'react';
import styles from './ViewProfile.module.css';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaHeart } from 'react-icons/fa';
import noblogs from '../../assets/usernoblogs.webp';
import fallback from '../../assets/fallback.webp';
import loadingImg from '../../assets/loading.webp';
import person from '../../assets/person.png';
import write from '../../assets/write.png';
import share from '../../assets/share.png';
import { toast } from 'react-toastify';

const ViewProfile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth(app);

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState(null);
  const [oneLiner, setOneLiner] = useState(null);
  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);

  const backendApi = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if(user.uid === userId){
            navigate('/profile');
        }
        setCurrentUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCurrentUserName(data.name);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfileImage(data.photoURL || null);
        setName(data.name || null);
        setOneLiner(data.oneLiner || null);
        setBio(data.bio || null);
      }
    };
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${backendApi}/publicblogs/${userId}`);
        const data = await res.json();
        const formattedBlogs = data.map(blog => {
          blog.createdDate = blog.createdAt?._seconds ? new Date(blog.createdAt._seconds * 1000) : null;
          return blog;
        });
        setBlogs(formattedBlogs);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setBlogLoading(false);
      }
    };
    setLoading(true);
    Promise.all([fetchProfile(), fetchBlogs()]).finally(() => setLoading(false));
  }, [userId, backendApi]);

  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const handleWrite = () => navigate('/write-story');
  const handleProfile = () => navigate('/profile');

const handleShare = () =>{
    const shareUrl = `${window.location.origin}/user/${userId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
    toast.success('Profile link copied to clipboard!');
    }); 
};

  return (
    <div className={styles.wrapper}>
      {loading && <div className={styles.spinner}></div>}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/home" className={styles.logoName}>Verbio</Link>
        </div>
        <div className={styles.navButtons}>
          {currentUser ? (
            <>
              <div className={styles.writeIconDiv}>
                <img src={write} alt="write" className={styles.writeIcon} onClick={handleWrite} />
              </div>
              <div className={styles.profile} onClick={handleProfile}>
                <div className={styles.profileIconDiv}>
                  <img src={person} alt="profile" className={styles.profileIcon} />
                </div>
                <div className={styles.userName}>{currentUserName}</div>
              </div>
            </>
          ) : (
            <Link to="/login" state={{ from: location.pathname }} className={styles.signIn}>
              Sign in
            </Link>
          )}
        </div>
      </nav>
      <div className={styles.contentWrapper}>
        <div className={styles.profileSection}>
          <div className={styles.profilePic}>
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className={styles.actualPic}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallback;
                }}
              />
            ) : (
              <img src={fallback} alt="Fallback" className={styles.fallback} />
            )}
          </div>
          {name && <div className={styles.userNameProfile}>{name}</div>}
          <div className={styles.oneliner}>
            {oneLiner || 'Documenting thoughts with purpose.'}
          </div>
          <div className={styles.bioDiv}>
            <div className={styles.bioHeading}>Bio</div>
            <div className={styles.bio}>
              {bio || 'Sharing thoughts and stories on Verbio — where ideas find their voice. Stay curious, stay inspired.'}
            </div>
          </div>
            <div className={styles.share} onClick={handleShare}>
                <img src={share} alt="share" className={styles.shareIcon} />
                <div className={styles.shareText}>Share</div>
        </div>    
        </div>
        <div className={styles.verticalLine}></div>
        <div className={styles.blogSection}>
          {blogLoading ? (
            <div className={styles.loadingImgDiv}>
              <img src={loadingImg} className={styles.loadingImg} alt="Loading" />
            </div>
          ) : blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <div key={index} className={styles.eachBlog}>
                <div className={styles.firstLine}>
                  <Link to={`/blog/${blog.id}`} className={styles.blogTitle}>
                    {blog.title}
                  </Link>
                </div>
                <div className={styles.secondLine}>
                  <div className={styles.date}>
                    {blog.createdDate?.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className={styles.likeSection}>
                    <FaHeart className={styles.likedHeart} />
                    <div className={styles.likeCount}>{blog.likes}</div>
                  </div>
                </div>
                <div className={styles.blogContent}>
                  {stripHtml(blog.content).split(' ').slice(0, 18).join(' ')}...
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noBlog}>
              <img src={noblogs} alt="No blogs" className={styles.noBlogsimg} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
