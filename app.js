const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const app = express();

app.use(bodyParser.json());

//graphqlHTTP exports middleware function tha ttakes incoming requeests, and funnel them to graphql query parser
//rootValue has all the resolvers
//graphql exposes full query language,
//need to define what data you want to support and what commands

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
    type Event 
    {
        _id: ID!
        title: String!
        description : String!
        price: Float!
        date: String!
        creator: User!

    }

    type User
    {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event]!

    }
    input EventInput 
    {
        title: String!
        description : String!
        price: Float!
        date: String!
        
    }
    input UserInput
    {
        email: String!
        password: String!

    }

    type RootQuery 
     { 
         events: [Event!]!

     }
     type RootMutation
      {
          createEvent(eventInput:EventInput): Event
          createUser(userInput: UserInput) : User

      }
    schema {
        query : RootQuery
        mutation: RootMutation
    }
    
    `),
    rootValue: {
      events: () => {
        //find allows us to find documents in that collection
        //return since it is async
        return Event.find()
          .then(events => {
            return events.map(event => {
              return { ...event._doc };
            });
          })
          .catch(e => {
            throw e;
          });
      },
      createEvent: args => {
        const { eventInput } = args;

        const event = new Event({
          title: eventInput.title,
          description: eventInput.description,
          price: +eventInput.price,
          date: new Date(eventInput.date),
          creator: "5d2a783a5fc64677ec623779"
        });
        let createdEvent;
        //hit database and write our data as defined in the model
        //returns promise like object
        return event
          .save()
          .then(result => {
            createdEvent = { ...result._doc, _id: result._doc._id.toString() };
            return User.findById("5d2a783a5fc64677ec623779")
              .then(user => {
                if (!user) {
                  throw new Error("user does not exist");
                }
                user.createdEvents.push(event);
                return user.save();
              })
              .then(result => {
                return createdEvent;
              })
              .catch();
          })
          .catch(e => {
            console.log("error when saving data to db: ", e);
            throw e;
          });
      },
      createUser: args => {
        const { userInput } = args;
        return User.findOne({
          email: userInput.email
        })
          .then(user => {
            if (user) {
              throw new Error("Email id already exists");
            }
            return bcrypt.hash(userInput.password, 12);
          })
          .then(hashedPassword => {
            const user = new User({
              email: userInput.email,
              password: hashedPassword
            });
            return user.save();
          })
          .then(result => {
            return { ...result._doc, _id: result.id };
          })
          .catch(e => {
            throw e;
          });
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(
    "mongodb+srv://sasAdmin:sashank007@cluster0-5tmsn.mongodb.net/events?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(e => {
    console.log("Error : ", e);
  });
