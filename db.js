import mongoose from 'mongoose';

// connect to locally running MongoDB instance
let dbURI = 'mongodb://localhost:27017/msgs_db';
mongoose.set('strictQuery', true);
mongoose.connect(dbURI);

// print message to console when connected ot DB
mongoose.connection.on('connected', () => {
  console.log('Mongoose conencted to ' + dbURI);
});

// print error message to console if there is a problem connecting
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

import './models/message-schema.js';
import './models/user-schema.js';
//import './models/menu-schema.js';