// ***********
// Schema for the Comment subdocument
// ***********

const mongoose = require('../utils/connection')

// destructure mongoose, 
// since we are building a subdocument we don't need the model
// SUBDOCUMENTS ARE NOT MONGOOSE MODELS!!!

const { Schema } = mongoose

// create comment schema

const commentSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

// there is no model function
// SUBDOCUMENTS ARE NOT MONGOOSE MODELS!!!

// ***********
// Export Schema
// ***********

module.exports = commentSchema
