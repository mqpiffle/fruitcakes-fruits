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
const User = require('./models/user')
const middleware = require('./utils/middleware')

// ***********
// Create our Express App Object
// ***********

const app = express()

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

app.get('/', (req, res) => {
    res.send('Server is live, ready for requests')
})

// this is now where we register our routes
// this is how server.js knows to send the correct response
// app.use when we register our route, needs two args
// 1st arg -> base url
// 2nd arg -> file to use

app.use('/fruits', FruitRouter)
app.use('/users', UserRouter)

// ***********
// Server Listener
// ***********

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listnening to the sweet sounds of port: ${PORT}`))

// END