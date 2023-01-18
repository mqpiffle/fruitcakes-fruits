// ***********
// Import Dependencies
// ***********

const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

// ***********
// Create Router
// ***********

const router = express.Router()

// ***********
// Routes
// ***********

// POST -> /users/signup
// this route creates new users in our db

router.post('/signup', async (req, res) => {
    // this route will take a req.body and use that data to create a user
    const newUser = req.body
    console.log('this is req.body', req.body)
    // we'll need to encrypt their password
    // this is where bcrypt comes into play
    // for the sake of bcrypt, we're going to use async / await
    newUser.password = await bcrypt.hash(
        newUser.password,
        await bcrypt.genSalt(10)
    )
    res.json({ newUser: newUser })
    // then create the user
    // if we're successful, send a 201 status
    // if there is an error, handle the error
})



// ***********
// Export Router
// ***********

module.exports = router