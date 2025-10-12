// blogPost.js
const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: String,
    reserveName: String,
    dateRange: String,
    location: String,
    day1: [String],
    day2: [String],
    day3: [String],
    day4: [String],
    packageIncludes: [String],
    exclusions: [String]
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
