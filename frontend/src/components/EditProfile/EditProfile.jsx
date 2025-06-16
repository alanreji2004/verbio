import React, { useEffect, useState } from 'react';
import styles from './EditProfile.module.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || '');
          setOneLiner(data.oneLiner || '');
          setBio(data.bio || '');
          setProfileImage(data.photoURL || null);
          setOriginalData({
            name: data.name || '',
            oneLiner: data.oneLiner || '',
            bio: data.bio || '',
            photoURL: data.photoURL || null
          });
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 3000000) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setIsModified(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e, setter) => {
    setter(e.target.value.slice(0, 100));
    setIsModified(true);
  };

  const handleCancel = () => {
    setName(originalData.name);
    setOneLiner(originalData.oneLiner);
    setBio(originalData.bio);
    setProfileImage(originalData.photoURL);
    setPreviewImage(null);
    setIsModified(false);
    navigate('/profile');
  };

  const uploadToCloudinary = async (base64Image) => {
    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
    return response.data.secure_url;
  };

  const handleSave = async () => {
    let photoURL = profileImage;
    setLoading(true);
    if (previewImage) {
      photoURL = await uploadToCloudinary(previewImage);
    }
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      name,
      oneLiner,
      bio,
      photoURL
    });
    navigate('/profile');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div className={styles.mainDiv}>
        {loading && <div className={styles.spinner}></div>}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoName}>Verbio</Link>
        </div>
        <div className={styles.navButtons}>
          <button className={styles.btn} onClick={handleProfile}>Profile</button>
        </div>
      </nav>
      <div className={styles.container}>
        <div className={styles.card}>
          <label htmlFor="profilePic" className={styles.imageUpload}>
            {previewImage ? (
              <img src={previewImage} className={styles.imagePreview} alt="Preview" />
            ) : profileImage ? (
              <img src={profileImage} className={styles.imagePreview} alt="Current" />
            ) : (
              <div className={styles.placeholder}>
                <div className={styles.head}></div>
                <div className={styles.body}></div>
              </div>
            )}
            <input type="file" id="profilePic" accept="image/*" onChange={handleImageChange} hidden />
          </label>
          <div className={styles.clickText}>Click image to edit</div>
          <input type="text" value={name} placeholder="Your Name" onChange={(e) => handleInputChange(e, setName)} className={styles.input} />
          <input type="text" value={oneLiner} placeholder="One-liner (max 25 chars)" onChange={(e) => handleInputChange(e, setOneLiner)} className={styles.input} />
          <input type="text" value={bio} placeholder="Bio (max 100 chars)" onChange={(e) => handleInputChange(e, setBio)} className={styles.descInput} />
          <div className={styles.buttons}>
            <button className={styles.btn} onClick={handleCancel}>Cancel</button>
            <button className={styles.btn} onClick={handleSave} disabled={!isModified}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
