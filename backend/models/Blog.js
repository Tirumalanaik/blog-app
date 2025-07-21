// models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true // rich text (quill or markdown)
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'General'
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
