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

// res.resnder POINTS TO A FILE
// res.redirect POINTS TO A ROUTE

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
        .populate('comments.author', '-password')
        .then(fruits => {
            // res.json({ fruits: fruits })
            // now that we are using liquid
            // we are going to use render as a response
            res.render('fruits/index', { fruits, ...req.session })
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
    // send json if successful
    // catch errors
})

// GET for the NEW page
// shows a form where the user can create a new fruit

router.get('/new', (req, res) => {
    res.render('fruits/new', { ...req.session })
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    
    // luckily for us we saved the user's id on the session object so it's really easy for us to access that data
    req.body.owner = req.session.userId
    // here we'll have something called a request body
    // called req.body
    // pass req.body to the create method
    // we want to add an owner field to our fruit
    // we need to do a little js magic for our checkbox
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false

    const newFruit = req.body 
       console.log('this is req.body before owner: \n', req.body)

    Fruit.create(newFruit)
        .then(fruit => {
            // then send a 201 status along with the json response of the new route
            // res.status(201).json({ fruit: fruit.toObject() })
            // view
            // mine page
            // res.redirect('/fruits/mine')
            // new fruit's show page
            res.redirect(`/fruits/${fruit.id}`)
        })
        .catch(err => {
            // send an error if one occurs
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET route 
// Index => user specific route
// this will show the logged in user's fruits
router.get('/mine', (req, res) => {
    // find fruits by ownership, using req.session info
    Fruit.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(fruits => {
            // if found display fruits
            res.render('fruits/index', { fruits, ...req.session })
        })
        .catch(err => {
            // otherwise throw error
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET request -> edit route
// shows the form for getting the fruit
router.get('/edit/:id', (req, res) => {
    const fruitId = req.params.id
    Fruit.findById(fruitId)
        .then(fruit => {
            res.render('fruits/edit', { fruit, ...req.session })
        })
        .catch(err => {
            res.redirect('/error?error=${err}')
        })

})
// UPDATE route

router.put('/:id', (req, res) => {
    const id = req.params.id
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    Fruit.findById(id)
        .then(fruit => {
            // if the owner of the fruit is the person who is logged in
            if (fruit.owner == req.session.userId) {
                //update and save the fruit
                // res.sendStatus(204)
                // and send success message
                return fruit.updateOne(req.body)
            } else {
                // otherwise send a 401 unauthorized status
                res.redirect(`/error?error=${err}`)
            }
        })
        .then(fruit => {
            res.redirect(`/fruits/${fruit.id}`)
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
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
                // res.sendStatus(204)
                // and send success message
                return fruit.deleteOne()
            } else {
                // otherwise send a 401 unauthorized status
                res.redirect(`/error?error=${err}`)
            }
        })
        .then(() => {
            res.redirect('/fruits/mine')
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
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
            res.render('fruits/show.liquid', { fruit, ...req.session })
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})



// ***********
// Export Router
// ***********

module.exports = router
