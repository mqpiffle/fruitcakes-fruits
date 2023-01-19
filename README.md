# Fruitcakes full CRUD Full Stack App

- Use Express to build a server
- Use Mongoose to communicate with mongoDB
- Full CRUD functionality on our fruits resource
- User Authentication
- ability to add comments to fruits
- (maybe gather data from a 3rd party API)


This app will start as an API that receiver requests and sends JSON responses, but eventually we will add a views layer that will render HTML in a browser.

This is an MVC application.  

We're using the MVC system for organizing our code.  This breaks our app down into these three parts.

MVC stands for
- Models
- Views
- Controllers

Models -all our data, what shape it's in and what resourse we're using, and how our resources relate to one another.

Views - the different ways we can see our data, whether it's a JSON response or an HTML response. Determines how our data can be viewed by the user.

Controllers - Tell us what we can do and connect views to our models. We can think of our routes as out controllers, because they determine how a user can interaect with our resources.

## How we talk about what we're doing

We're using express framework to build a server, in which we are using mongoose to process a request and run CRUD operations using a mongoDB instance.

What we're building is a REST api that runs full CRUD operations on a single resource. 

## What is REST???

- REST stands for REpresentational State Transfer

It's a set of principles that describe how networked resources are accessed and manipulated.

There are 7 RESTful routes that allow us basic operations for reading and manipulating a collection of data:

## Route tables for documents

#### Fruits

| **URL**          | **HTTP Verb**|**Action**|
|------------------|--------------|----------|
| /comments/:fruitId| POST          | create  
| /comments/delete/:fruitId/:commentId      | DELETE          | destroy       

#### Comments

| **URL**          | **HTTP Verb**|**Action**|
|------------------|--------------|----------|
| /fruits/         | GET          | index  
| /fruits/:id      | GET          | show       
| /fruits/new      | GET          | new   
| /fruits          | POST         | create   
| /fruits/:id/edit | GET          | edit       
| /fruits/:id      | PATCH/PUT    | update    
| /fruits/:id      | DELETE       | destroy 

#### Users

| **URL**          | **HTTP Verb**|**Action**|
|------------------|--------------|----------|
| /users/signup    | POST         | create 
| /users/login     | POST         | create      
| /users/logout    | DELETE       | destroy   


So far, we've used 5 of these 7 RESTful routes to build our API.

The two routes that we haven't used so far are `new` and `edit`.  These are designed to display a page that renders a form, so that we can send a request body from the browser to our server.

## File Organization
### Where are things happening?

Main entry file is still `server.js`. This is where we establish our connection with express, to the port 3000, which allows us to develop locally. 

`server.js` import our `fruitConrollers` from the controllers directory.

`fruitControllers` is where we setup our routes to utilize mongoose to interact with fruit documents in our mongodb.

The connection between fruits and mongodb starts with the file `utils/connection.js`, where we define and connect to our database. The Fruit model in `models/fruit.js` is where this connection happens. Our fruitControllers import the model Fruit, and run mongoose model methods whenever we hit the appropriate route.

## Middleware

Middleware is processed by a function in the utils directory `utils/middleqare.js`. 

This middleware function takes one argument, app, and processes requests through our middleware.

## Relationships

One to many: 
    - One user can have many routes
    - One fruit can have many comments

Fruits are connected to Users through tthe `fruit.owner` field via the `objectId` reference.

Comments are connected to Fruits as an array of subdocuments at `fruit.comments`.

Users are connected to comments via `objectId` reference at `comment.author`.

This is an enitity relationship diagram (not shown). This accurately describes the relationships between the documents of this project.