import {React,useState,useEffect,useRef} from 'react'
import styles from './ViewBlog.module.css'
import { Link, useNavigate,useParams } from "react-router-dom"
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';
import person from '../../assets/person.png'
import write from '../../assets/write.png'
import { toast } from 'react-toastify';
import share from '../../assets/share.png'
import read from '../../assets/read.png'
import play from '../../assets/play.png'
import pause from '../../assets/pause.png'

const ViewBlog = () => {
    const navigate = useNavigate()
    const auth = getAuth(app);
    const [user,setUser] = useState(null);
    const [photo,setPhoto] = useState(null);
    const [name,setName] = useState(null);
    const [loading,setLoading] = useState(false);
    const [blog,setBlog] = useState(null);
    const [isReading,setIsReading] = useState(false);
    const [isPaused,setIsPaused] = useState(false);
    const utteranceRef = useRef(null);

    const backendApi = import.meta.env.VITE_BACKEND_API;
    const {id: blogId} = useParams()

    const handleToProfile = () => {
        navigate('/profile');
    };

    const handleWrite = () =>{
    navigate('/write-story');
    }

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

    useEffect(()=>{
        const fetchBlog = async () =>{
            setLoading(true);
            try{
                const response = await fetch(`${backendApi}/getblog/${blogId}`);

                if (response.status === 404) {
                    toast.error('Blog not Found');
                    setLoading(false);
                    return;
                }

                if (!response.ok) throw new Error('Blog not found');

                const data = await response.json();

                if (data.createdAt && data.createdAt._seconds) {
                data.createdDate = new Date(data.createdAt._seconds * 1000);
                }
                setBlog(data);
            }catch(err){
                console.error('Error fetching blog');
                toast.error('Unable to load blog');
            }
            setLoading(false);
        }
        if (blogId) fetchBlog();
    },[blogId]);

    const handleShare = () =>{
        const blogLink = window.location.href;
        navigator.clipboard.writeText(blogLink)
            .then(() =>{
                toast.success("Link copied to clipboard");
            })
            .catch(err => {
                toast.error("Failed to copy")
            });
    };

    const handleLogo = () =>{
        navigate('/home');
    }

    const stripHtmlTags = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    const handleStartReading = () => {
        if(!blog || !blog.content) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(
            stripHtmlTags(blog.title + '. ' + blog.content)
        );

        utterance.lang = 'en-US';

        utterance.onend = () =>{
            setIsReading(false);
            setIsPaused(false);
        };

        utterance.onerror = () =>{
            console.log('TTS error:',err);
            toast.error("error while reading");
            setIsReading(false);
            setIsPaused(false);
        }

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsReading(true);
        setIsPaused(false);
    };

    const handlePauseReading = () =>{
        if(!window.speechSynthesis.speaking) return;
        if(window.speechSynthesis.paused){
            window.speechSynthesis.resume();
            setIsPaused(false);
        }else{
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            window.speechSynthesis.cancel();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.speechSynthesis.cancel();
        };
    }, []);


  return (
    <div className={styles.mainDiv}>
      {loading && <div className={styles.spinner}></div>}
        <nav className={styles.navbar}>
            <div className={styles.logo} onClick={handleLogo}>Verbio</div>
            <div className={styles.navButtons}>
                {user ? (
            <>
                <div className={styles.writeIconDiv}>
                <img src={write} alt="write" className={styles.writeIcon} onClick={handleWrite} />
            </div>
            <div className={styles.profile} onClick={handleToProfile}>
            <div className={styles.profileIconDiv}>
                <img src={person} alt="profile" className={styles.profileIcon} />
            </div>
            <div className={styles.userName}>{name}</div>
            </div>
        </>
        ) : (
        <Link to="/login" className={styles.signIn}>Sign in</Link>
        )}
    </div>
    </nav>

      {!loading && blog && blog.title && blog.content &&(
        <div className={styles.contentDiv}>
            <div className={styles.header}>
                <div className={styles.headingLine}>
                    <div className={styles.heading}>{blog.title}</div>
                </div>
                <div className={styles.nameAndDate}>
                    <div className={styles.authorName}>{blog.authorName}</div>
                    <div className={styles.date}>
                        {blog.createdDate && blog.createdDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                         })}
                    </div>
                </div>
            </div>
            <div className={styles.buttons}>
                <div className={styles.tooltipWrapper}>
                    <div className={styles.share} onClick={handleShare}>
                        <img src={share} alt="share" className={styles.shareIcon} />
                        <div className={styles.shareText}>Share</div>
                    </div>
                    <span className={styles.tooltip}>Copy blog link</span>
                </div>
                <div className={styles.tooltipWrapper}>
                                    <div className={styles.speechControls}>
                    {!isReading ? (
                        <div className={styles.readButtonDiv}>
                            <img src={read} alt="read" className={styles.readButton}
                            onClick={handleStartReading}/>
                        </div>
                    ):(
                        <div className={styles.pauseOrPlay}>
                            {isPaused?(
                                <img src={play} alt="play" className={styles.playButton} onClick={handlePauseReading} />
                            ):(
                                <img src={pause} alt="pause" className={styles.pauseButton} onClick={handlePauseReading} />
                            )}
                        </div>
                    )}
                </div>
                <span className={styles.tooltip}>Read Aloud</span>
                </div>
            </div>
            <div className={styles.content} dangerouslySetInnerHTML={{ __html: blog.content }}></div>
        </div>
      )}
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

export default ViewBlog
