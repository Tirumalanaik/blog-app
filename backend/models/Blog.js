﻿const mongoose = require('mongoose'); 

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
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
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
