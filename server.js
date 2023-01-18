// ***********
// Import Dependencies
// ***********

const express = require('express') // import the express framework
const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // Load my ENV file's variables
const path = require('path') // import path module
const FruitRouter = require('./controllers/fruitControllers')

// ***********
// Import Models
// ***********

const Fruit = require('./models/fruit')

// ***********
// Databse Connection
// ***********

// this is where we will set up our inputs for our database connect function

const DATABASE_URL = process.env.DATABASE_URL

// here is our DB config object - required by mongoose

const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// establish db connection

mongoose.connect(DATABASE_URL, CONFIG)

// Tell mongoose what to do will certain events
// what happens when we open this connect or get an error

mongoose.connection
    .on('open', () => console.log('Connected to mongoose'))
    .on('close', () => console.log('Disconnected from mongoose'))
    .on('error', (err) => console.log('An error ocurred: \n', err))

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

app.use(morgan('tiny')) // this is for request logging, the 'tiny' argument declares what size of morgan log to use
app.use(express.urlencoded({ extended: true })) // this parses urlEncoded reuest bodies, useful for POST and PUT requests
app.use(express.static('public')) // this serves static files from the 'public' folder
app.use(express.json()) // this parses incoming request payloads with JSON



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
// 2nd arf -> file to use

app.use('/fruits', FruitRouter)

// ***********
// Server Listener
// ***********

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listnening to the sweet sounds of port: ${PORT}`))

// END