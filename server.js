// ***********
// Import Dependencies
// ***********

const express = require('express') // import the express framework
const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // Load my ENV file's variables

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
// Server Listener
// ***********

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listnening to the sweet sounds of port: ${PORT}`))

// END