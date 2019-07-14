const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const app = express();
const graphQLBuildScheme = require("./graphql/schema/index");
const graphQLResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

app.use(bodyParser.json());

//have to use middleware to protect indiviudal resolvers
//if you pass as reference, express will run it as middleware
//every incoming request is run through isAuth to check if authorized

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

//after headers set , do auth
app.use(isAuth);

//graphqlHTTP exports middleware function tha ttakes incoming requeests, and funnel them to graphql query parser
//rootValue has all the resolvers
//graphql exposes full query language,
//need to define what data you want to support and what commands
app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQLBuildScheme,
    rootValue: graphQLResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    "mongodb+srv://sasAdmin:sashank007@cluster0-5tmsn.mongodb.net/events?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(8000);
  })
  .catch(e => {
    console.log("Error : ", e);
  });
