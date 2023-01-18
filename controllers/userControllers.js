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
    // console.log('this is req.body', req.body)
    // we'll need to encrypt their password
    // this is where bcrypt comes into play
    // for the sake of bcrypt, we're going to use async / await
    newUser.password = await bcrypt.hash(
        newUser.password,
        await bcrypt.genSalt(10)
    )
    // then create the user
    User.create(newUser)
        // if we're successful, send a 201 status
        .then(user => {
            // console.log('new user created \n', user)
            res.status(201).json({ username: user.username})
        })
        // if there is an error, handle the error
        .catch(err => {
            console.log(err)
            res.json(err)
        })
})

// POST -> /users/login
// this route creates a new session in our db and our browser

router.post('/login', async (req, res) => {
    // destructure the username and pw from our request body
    const { username, password } = req.body

    // search the db for a  user with a specific username
    User.findOne({ username })
        .then(async (user) => {
            // we check if that user exist, 
            if (user) {
                // if they do we compare the pw's using bcrypt
                // bcrypt.compare -> evaluates to a truthy or falsey value
                // we'll save that result to a variable
                // password -> req.body
                // user.password -> saved in database
                const result = await bcrypt.compare(password, user.password)

                
                if (result) {
                    // if the pw's match, place the user's info in the session
                    // this is where we use the session object that lives in our request object
                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id

                    // console.log('this is req.session \n', req.session)

                    // we'll send a 201 response
                    res.status(201).json({ username: user.username })
                } else {
                    // if the pw's don't match, send the user a message
                    res.json({ error: 'username or password is incorrect'})
                }
            } else {
                // if a user does not exist, we respond with a message saying so
                res.json({ error: 'user does not exist' })
            }
             
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })

})

// DELETE -> /users/logout
// this route destroys a session in our db and the browser
router.delete('/logout', (req, res) => {
    // destroy session and send an appropriate response
    req.session.destroy(err => {
        console.log('this is req.session upon logout \n', req.session)
        console.log('error on logout? \n', err)
        //eventually we will rediect users here, after view layer
        res.sendStatus(204)
    })
})

// ***********
// Export Router
// ***********

module.exports = router