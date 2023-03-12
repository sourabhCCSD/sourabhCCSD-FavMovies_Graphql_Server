const express = require('express');
const app = express();
const port = process.env.PORT || 3002
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose')
const cors = require('cors');


app.use(cors());
require('dotenv').config()

mongoose.connect('mongodb+srv://sourabhmdb:Hichki1990@srvcluster.gbqvd3s.mongodb.net/?retryWrites=true&w=majority')
.then(
    console.log('Successfully connected to Database.')
)
.catch(err => {
    console.log(err)
});

app.use("/graphql", graphqlHTTP ({  // javascript doesn't understand how to deal with graphql. So graphqlHTTP
    schema,
    graphiql: true
}))

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})