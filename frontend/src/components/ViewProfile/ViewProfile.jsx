import { React, useState, useEffect } from 'react';
import styles from './ViewProfile.module.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';
import { getAuth } from 'firebase/auth';
import { FaHeart } from 'react-icons/fa';
import noblogs from '../../assets/noblogs.webp';
import fallback from '../../assets/fallback.webp';
import loadingImg from '../../assets/loading.webp';

const ViewProfile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState(null);
  const [oneLiner, setOneLiner] = useState(null);
  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const backendApi = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    const fetchProfile = async () => {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.photoURL) setProfileImage(data.photoURL);
        setName(data.name);
        if (data.oneLiner) setOneLiner(data.oneLiner);
        if (data.bio) setBio(data.bio);
      }
    };

    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${backendApi}/publicblogs/${userId}`);
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
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setBlogLoading(false);
      }
    };

    setLoading(true);
    Promise.all([fetchProfile(), fetchBlogs()]).then(() => setLoading(false));
  }, [userId, backendApi]);

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
      </nav>
      <div className={styles.contentWrapper}>
        <div className={styles.profileSection}>
          <div className={styles.profilePic}>
            {profileImage ? (
              <img src={profileImage} alt="" className={styles.actualPic}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallback;
                }}
              />
            ) : (
              <div className={styles.profileIcon}>
                <img src={fallback} alt="" className={styles.fallback} />
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
        </div>
        <div className={styles.verticalLine}></div>
        <div className={styles.blogSection}>
          {blogLoading ? (
            <div className={styles.loadingImgDiv}>
              <img src={loadingImg} className={styles.loadingImg} alt="" />
            </div>
          ) : (
            blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <div key={index} className={styles.eachBlog}>
                  <div className={styles.firstLine}>
                    <Link to={`/blog/${blog.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className={styles.blogTitle}>{blog.title}</div>
                    </Link>
                  </div>
                  <div className={styles.secondLine}>
                    <div className={styles.dateSection}>
                      <div className={styles.date}>
                        {blog.createdDate && blog.createdDate.toLocaleDateString('en-US', {
                          year: 'numeric',
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
                  <div className={styles.blogContent}>
                    {stripHtml(blog.content)?.split(' ').slice(0, 18).join(' ')}...
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noBlog}>
                <img src={noblogs} alt="" className={styles.noBlogsimg} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
