// ***********
// Import Dependencies
// ***********

const Fruit = require('./fruit')
const mongoose = require('../utils/connection')

// this will seed our db
// only an admin can run this
// will be run with npm run seed

// router.get('/seed', (req, res) => {
//     // array of starter resources(fruits)
//     const startFruits = [{
//         name: 'Orange',
//         color: 'orange',
//         readyToEat: true
//     },{
//         name: 'Grape',
//         color: 'purple',
//         readyToEat: true,
//     },{
//         name: 'Banana',
//         color: 'green',
//         readyToEat: false
//     },{
//         name: 'Strawberry',
//         color: 'red',
//         readyToEat: false
//     },{
//         name: 'Coconut',
//         color: 'brown',
//         readyToEat: true
//     }]
//     //then we delete every fruit in the database(all instances of this resource )
//     Fruit.deleteMany({})
//         .then(() => {
// // then we'll seed(create) our starter fruits
//             Fruit.create(startFruits)
//             .then(data => {
//                 res.json(data)
//             })
//             .catch(err => console.log('The following error ocurred: \n', err))
//     // tell db what to do with success/failure
//         })
    
// })

// ***********
// Seed Script Code
// ***********

// first, we'll save our db connection to a variable

const db = mongoose.connection

db.on('open', () => {
    const startFruits = [
    {
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
    //this will delete any fruits that are not owned by a user
    Fruit.deleteMany({ owner: null })
        .then(() => {
            // then we'll seed(create) our starter fruits
            Fruit.create(startFruits)
            .then(data => {
                console.log('here are the created fruits: \n', data)
                // ALWAYS close the connection
                db.close()
            })
            .catch(err => {
                console.log('The following error ocurred: \n', err)
                // ALWAYS close the connection
                db.close()
            })
            // tell db what to do with success/failure

        })
        .catch(err => {
            console.log(err)
            // ALWAYS close the connection
            db.close()
        })
})