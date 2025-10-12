const express = require("express");
const mongoose = require("mongoose");
const Blogwriting = require("./blogwriting"); // your model

const app = express();
app.use(express.json()); // ✅ built-in JSON parser

// Connect to MongoDB
mongoose.connect("mongodb+srv://adminuser:admin12345@cluster0.yrsibmy.mongodb.net/JungleHuesblogtour")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error", err));

// POST route
app.post("/api/blogwriting", async (req, res) => {
  try {
    const blog = new Blogwriting(req.body);
    const saved = await blog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET route
app.get("/api/blogwriting", async (req, res) => {
  try {
    const blogs = await Blogwriting.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
