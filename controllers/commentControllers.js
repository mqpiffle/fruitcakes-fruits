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

// with post and delete

// subdocuments are not mongoose models
// they don't have their own collection and they don't have the same model method
// they have tehir own built-in methods
// a subdoc is never going to be view w/o it's parent document
// therefore we'll never see a comment without seeing the fruit it was commented on first

// when we create a subdoc we MUST refer to the parent so that mongoose knows where in mongodb to store the subdoc

// POST => '/comments/<someFruitId>'
// only logged in users may post comments b/c author field is required in commentSchema
// refer to fruit in route

router.post('/:fruitId', (req, res) => {
    // first we get the fruitId and save it to a variable
    const fruitId = req.params.fruitId
    // then we'll protect this route against non-logged in users
    if (req.session.loggedIn) {
        // make logged in user author of comment
        req.body.author = req.session.userId
        const theComment = req.body
        // find a specific fruit
        Fruit.findById(fruitId)
            .then(fruit => {
                // create the comment with a req.body
                fruit.comments.push(theComment)
                // save the fruit
                return fruit.save()
            })
            // respond with a 201 and the fruit itself
            .then(fruit => {
                res.status(201).json({ fruit: fruit })
            })
            // catch and handle any errors
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    } else {
        // escape our route by sending response
        res.sendStatus(401) // 401 unauthorized
    }
})

// DELETE => '/comments/delete/<someFruitId>/<someCommentId>'
// make sure only the author of the comment can delete the comment
router.delete('/delete/:fruitId/:commId', (req, res) => {
    // isolate the ids and save to variables
    const { fruitId, commId } = req.params
    // get the fruit
    Fruit.findById(fruitId)
        .then(fruit => {
            // get the comment using built in subdoc method .id()
                const theComment = fruit.comments.id(commId)
                console.log('this is the comment to be deleted \n', theComment)
            // make sure user is logged in and they are the author of the comment
            if (req.session.loggedIn) {
                // if they are the author allow them to delete
                if (theComment.author == req.session.userId) {
                    // we can use another built in method remove()
                    theComment.remove()
                    fruit.save()
                    res.sendStatus(204)
                } else {
                    //otherwise send a 401 unauthorized status
                    res.sendStatus(401)
                }
            } else {
                //otherwise send a 401 unauthorized status
                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

// ***********
// Export Router
// ***********

module.exports = router