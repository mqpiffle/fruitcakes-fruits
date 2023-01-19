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

// INDEX route 
// Read -> finds and displays all fruits

router.get('/', (req, res) => {
    // find all the fruits
    Fruit.find({})
        // there's a built-in function that runs before the rest of the promise chain
        // called populate, it's able to retrieve info for other documents in other collections
        .populate('owner', 'username')
        .populate('comments: author', '-password')
        .then(fruits => { res.json({ fruits: fruits })})
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
    // send json if successful
    // catch errors
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    console.log('this is req.body before owner: \n', req.body)
    // luckily for us we saved the user's id on the session object so it's really easy for us to access that data
    req.body.owner = req.session.userId
    // here we'll have something called a request body
    // called req.body
    // pass req.body to the create method
    // we want to add an owner field to our fruit
    const newFruit = req.body
    Fruit.create(newFruit)
        .then(fruit => {
            // then send a 201 status along with the json response of the new route
            res.status(201).json({ fruit: fruit.toObject() })
        })
        .catch(err => {
            // send an error if one occurs
            console.log(err)
            res.status(404).json(err)
        })
})

// GET route
// Index => user specific route
// this will show the logged in user's fruits
router.get('/mine', (req, res) => {
    // find fruits by ownership, using req.session info
    Fruit.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments: author', '-password')
        .then(fruits => {
            // if found display fruits
            res.status(200).json({ fruits: fruits })
        })
        .catch(err => {
            // otherwise throw error
            console.log(err)
            res.status(400).json(err)
        })
})

// UPDATE route

router.put('/:id', (req, res) => {
    const id = req.params.id
    Fruit.findById(id)
        .then(fruit => {
            // if the owner of the fruit is the person who is logged in
            if (fruit.owner == req.session.userId) {
                //update and save the fruit
                res.sendStatus(204)
                // and send success message
                return fruit.updateOne(req.body)
            } else {
                // otherwise send a 401 unauthorized status
                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

// DELETE route
// Delete -> deletes a specific route

router.delete('/:id', (req, res) => {
    const id = req.params.id
    Fruit.findById(id)
        .then(fruit => {
            // if the owner of the fruit is the person who is logged in
            if (fruit.owner == req.session.userId) {
                //update and save the fruit
                res.sendStatus(204)
                // and send success message
                return fruit.deleteOne()
            } else {
                // otherwise send a 401 unauthorized status
                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

// SHOW route
// Read -> finds and displays a single resource
router.get('/:id', (req, res) => {
    // get the id -> save to variable
    const id = req.params.id
    Fruit.findById(id)
        .populate('comments.author', 'username')
        .then(fruit => {
            res.json({ fruit: fruit })
        })
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})



// ***********
// Export Router
// ***********

module.exports = router
