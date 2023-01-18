// ***********
// Import Dependencies
// ***********

const express = require('express')
const Fruit = require('../models/fruit')

// ***********
// Create Router
// ***********

const router = express.Router()

// ***********
// Routes
// ***********

// we're going to build a seed route
// this will seed the db for us with a few starter resources
// there are two ways to seed a db
// first -> seed route, they work but they are not best practice
// second -> seed script, they work and they ARE best practice

router.get('/seed', (req, res) => {
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

router.get('/', (req, res) => {
    // find all the fruits
    Fruit.find({})
        .then(fruits => { res.json({ fruits: fruits })})
        .catch(err => console.log('The following error ocurred: \n', err))
    // send json if successful
    // catch errors
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Fruit.findByIdAndRemove(id)
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})
// SHOW route
// Read -> finds and displays a single resource
router.get('/:id', (req, res) => {
    // get the id -> save to variable
    const id = req.params.id
    Fruit.findById(id)
        .then(fruit => {
            res.json({ fruit: fruit })
        })
})



// ***********
// Export Router
// ***********

module.exports = router
