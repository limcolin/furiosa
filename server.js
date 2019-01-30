require('dotenv').config();
const { createServer } = require('http');
const next = require('next');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const api = require('./db/api');

const API_PORT = 3001;
const app = next({
    dev: process.env.NODE_ENV !== 'production'
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

const server = express();

// connect to database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
let db = mongoose.connection;

// checks if connection with the database is successful
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

server.use(bodyParser.json());
server.use((req, res, next) => {
    // Expose the MongoDB database handle so Next.js can access it.
    req.db = db;
    next();
});
server.use('/api', api(db));

server.get('*', (req, res) => {
    return handler(req, res);
});

app.prepare().then(() => {
  server.use(handler).listen(process.env.PORT || 3000, (err) => {
      if(err) throw err;
      console.log('Ready on localhost:3000');
  })
});
