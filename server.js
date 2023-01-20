// ***********
// Import Dependencies
// ***********

const express = require('express') // import the express framework
// const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // Load my ENV file's variables
const path = require('path') // import path module
const FruitRouter = require('./controllers/fruitControllers')
const UserRouter = require('./controllers/userControllers')
const CommentRouter = require('./controllers/commentControllers')
const middleware = require('./utils/middleware')

// ***********
// Create our Express App Object
// ***********

// this was fine for building an api that sends and receives json
// const app = express()

// but now our app is going to be full-stack
// means handling both fron-end and back-end from the same server in this case

// we're utilizing an npm pkg - liquid-express-views - to add the view layer to our mvc framework
// we need to update the app object to use that pkg

const app = require('liquid-express-views')(express())

// liquid-express-views makes it easy to path to our .liquid files which will serve our html
// looks inside 'views' folder for files with .liquid name

// ***********
// Middleware
// ***********

// ~~~ middleware runs before all the routes ~~~
// every *request* is processed through our middleware
// before mongoose can do anything with it

// middleware is now processed by a function in the utils directory. This middleware function takes one arg, app, and processes requests through our middleware.

middleware(app)

// ***********
// Routes
// ***********

//HOME route
app.get('/', (req, res) => {
    const { username, userID, loggedIn } = req.session
    res.render('home.liquid', { username, userID, loggedIn })
})

// this is now where we register our routes
// this is how server.js knows to send the correct response
// app.use when we register our route, needs two args
// 1st arg -> base url
// 2nd arg -> file to use

app.use('/fruits', FruitRouter)
app.use('/comments', CommentRouter)
app.use('/users', UserRouter)

// this renders our error page
// gets the error from a url request query

app.get('/error', (req, res) => {
    const error = req.query.error || 'This page does not exist'
    const { username, userID, loggedIn } = req.session
    res.render('error.liquid', { error, username, userID, loggedIn })
})

// this catch all route will redirect a user to the error page

app.all('*', (req, res) => {
    res.redirect('/error')
})

// ***********
// Server Listener
// ***********

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listnening to the sweet sounds of port: ${PORT}`))

// END