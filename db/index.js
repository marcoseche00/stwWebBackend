const mongoose = require('mongoose');
const db = require('../config/keys').mongoURI;


function connect() {
    return new Promise((resolve, reject) => {

          mongoose.connect(db,
            { useNewUrlParser: true, useCreateIndex: true })
            .then((res, err) => {
              if (err) return reject(err);
              resolve();
            })
      
    });
 }
  
  function close() {
    return mongoose.disconnect();
  }

  module.exports = { connect, close };
