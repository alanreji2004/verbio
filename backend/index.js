const express = require('express');
const cors = require('cors');
const { db } = require('./firebase');
const verifyToken = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5173', 'https://verbio.vercel.app'];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.post('/blogs',verifyToken,async (req,res) => {
    const{title,content} = req.body;

    if(!title || !content){
        return res.status(400).json({message : 'Title and Content is required'});
    }

    try{
        const blog ={
            title: title,
            content: content,
            authorId: req.user.uid,
            authorName: req.user.name,
            createdAt: new Date(),
            likes: 0,
            likedBy: [],
        }

        const docRef = await db.collection('blogs').add(blog);
        res.status(201).json({docId: docRef.id})
    }
    catch(err){
        console.error('Error writing blog:', err);
        res.status(500).json({ message: 'Failed to post blog'});
    }
});

app.get('/getblog/:id',async (req,res)=>{
    const blogId = req.params.id;
    try{
        const docRef = db.collection('blogs').doc(blogId);
        const docSnap = await docRef.get();

        if(!docSnap.exists){
            return res.status(404).json({message : 'Blog not Found'});
        }

        res.status(200).json(docSnap.data());
    }catch(error){
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));