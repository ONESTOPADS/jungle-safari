// blogwriting.js
const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"], 
    trim: true 
  },
  reserveName: { 
    type: String, 
    trim: true 
  },
  dateRange: { 
    type: Date, 
    required: [true, "Date is required"] 
  },
  location: { 
    type: String, 
    trim: true 
  },
  headline: { 
    type: [String], 
    default: [] 
  },
  description: { 
    type: [String], 
    default: [] 
  },
  authors: { 
    type: [String], 
    default: [] 
  },
  keytakeways: { 
    type: [String], 
    default: [] 
  },
  readingforest: { 
    type: [String], 
    default: [] 
  },
  light: { 
    type: [String], 
    default: [] 
  },
  Plansafari: { 
    type: [String], 
    default: [] 
  }
}, { timestamps: true }); 
// timestamps adds createdAt & updatedAt automatically

module.exports = mongoose.model("Blogwriting", BlogSchema);
