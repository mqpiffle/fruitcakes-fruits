// ***********
// Import Dependencies
// ***********

const express = require('express') // import the express framework
const mongoose = require('mongoose') // import the mongoose library
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // Load my ENV file's variables
const path = require('path') // import path module
const { allowedNodeEnvironmentFlags } = require('process')
const { start } = require('repl')

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

// we're going to build a seed route
// this will seed the db for us with a few starter resources
// there are two ways to seed a db
// first -> seed route, they work but they are not best practice
// second -> seed script, they work and they ARE best practice

app.get('/fruits/seed', (req, res) => {
    // array of starter resources(fruits)
    const startFruits = [{
        name: 'Orange',
        color: 'orange',
        readyToEat: true
    },{
        name: 'Grape',
        color: 'purple',
        readyToEat: true,
    },{
        name: 'Banana',
        color: 'green',
        readyToEat: false
    },{
        name: 'Strawberry',
        color: 'red',
        readyToEat: false
    },{
        name: 'Coconut',
        color: 'brown',
        readyToEat: true
    }]
    //then we delete every fruit in the database(all instances of this resource )
    Fruit.deleteMany({})
        .then(() => {
// then we'll seed(create) our starter fruits
            Fruit.create(startFruits)
            .then(data => {
                res.json(data)
            })
            .catch(err => console.log('The following error ocurred: \n', err))
    // tell db what to do with success/failure
        })
    
})

// INDEX route 
// Read -> finds and displays all fruits

app.get('/fruits', (req, res) => {
    // find all the fruits
    Fruit.find({})
        .then(fruits => { res.json({ fruits: fruits })})
        .catch(err => console.log('The following error ocurred: \n', err))
    // send json if successful
    // catch errors
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
app.post('/fruits', (req, res) => {
    // here we'll have something called a request body
    // called req.body
    // pass req.body to the create method
    const newFruit = req.body
    Fruit.create(newFruit)
        .then(fruit => {
            // then send a 201 status along with the json response of the new route
            res.status(201).json({ fruit: fruit.toObject() })
        })
        .catch(err => console.log(err))
    
    // send an error if one occurs
    
})

// PUT route
// Update -> updates a specific fruit
// PUT replaces the entire document with a new document from the request body
// PATCH is able to update specific fields at specific times, but it requires more code to ensure it runs properly
app.put('/fruits/:id', (req, res) => {
    // save id to a variable for easy use later
    const id = req.params.id
    // save the request body to a variable for easy reference later
    const updatedFruit = req.body
    // we're going to use the mongoose method:
    // findByIdAndUpdate
    // eventually we'll change how this route works but for now we'll do everything in one shot
    Fruit.findByIdAndUpdate(id, updatedFruit, { new: true })
        .then(fruit => {
            console.log('the newly updated fruit', fruit)
            // update success message
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})
// DELETE route
// Delete -> deletes a specific route
app.delete('/fruits/:id', (req, res) => {
    const id = req.params.id
    Fruit.findByIdAndRemove(id)
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})
// SHOW route
// Read -> finds and displays a single resource
app.get('/fruits/:id', (req, res) => {
    // get the id -> save to variable
    const id = req.params.id
    Fruit.findById(id)
        .then(fruit => {
            res.json({ fruit: fruit })
        })
})




// ***********
// Server Listener
// ***********

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listnening to the sweet sounds of port: ${PORT}`))

// END