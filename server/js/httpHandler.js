const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = require('./messageQueue');
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = () => { }) => {
  // console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(200, headers);
    // var commands = ['up', 'down', 'left', 'right'];
    // var selected = commands[Math.floor(Math.random() * 4)];
    // res.direction = selected;

    res.direction = messageQueue.dequeue()
    // console.log(messageQueue.messages)
    res.end(res.direction);
  }
  // console.log('res', res._data)

  next(); // invoke next() at the end of a request to help with testing!
};
