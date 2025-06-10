const express = require('express');
const cors = require('cors');
const { db } = require('./firebase');
const verifyToken = require('./middlware/authMiddleware');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

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
            createdAt: new Date(),
            likes: 0,
        }

        const docRef = await db.collection('blogs').add(blog);
        res.status(201).json({message: 'Blog Posted'})
    }
    catch(err){
        console.error('Error writing blog:', err);
        res.status(500).json({ message: 'Failed to post blog' });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));