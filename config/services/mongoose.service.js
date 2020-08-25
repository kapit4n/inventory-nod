const mongoose = require('mongoose');
let count = 0;

const options = {
  autoIndex: false,
  reconnectTries: 30,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0,
  userNewUrlParser: true,
  useUnifiedTopology: true
};

const connectWithRetry = () => {
  mongoose.connect("mongodb://mongo:27017/db", options).then(() => {
    console.log("Mongo connected");
  }).catch(err => {
    console.log("Rety to connect", ++count);
    setTimeout(connectWithRetry, 5000);
  })
}

connectWithRetry();

exports.mongoose = mongoose;