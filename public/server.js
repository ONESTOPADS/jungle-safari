const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const BlogPost = require('./blogPost');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://adminuser:admin12345@cluster0.yrsibmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// POST route
app.post('/api/blogposts', async (req, res) => {
    try {
        console.log("📩 Incoming POST body:", req.body);  // log body
        const post = new BlogPost(req.body);
        await post.save();
        console.log("✅ Saved post:", post);
        res.status(201).json({ message: 'Blog Post Saved!', post });
    } catch (error) {
        console.error('❌ POST /api/blogposts error:', error); // log full error
        res.status(400).send(error);   // 👈 send raw error object back
    }
});



// GET route
app.get('/api/blogposts', async (req, res) => {
    const posts = await BlogPost.find();
    res.json(posts);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
