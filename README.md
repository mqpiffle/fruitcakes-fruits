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