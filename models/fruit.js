// ***********
// Our schema and model for the fruit resource
// ***********

// this is the old mongoose import

// const mongoose = require('mongoose') // import mongoose 

// now we want our mongoose object to realte to our db
// so we're going to bring in the mongoose connection from our utils

const mongoose = require('../utils/connection')

// destructure the schema and model function from mongoose

const { Schema, model } = mongoose

// fruits schema setup

const fruitSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean
})

// make the fruit model
// the model method takes two arguments
// the first is what we call our model, the secound is the schema used to build the model

const Fruit = model('Fruit', fruitSchema)

// ***********
// Export model
// ***********

module.exports = Fruit