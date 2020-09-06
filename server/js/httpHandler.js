const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const url = require('url');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = require('./messageQueue');
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = () => { }) => {
  // console.log('Serving request type ' + req.method + ' for url ' + req.url);
  // console.log(req)
  // var parsedUrl = url.parse(req.url, true).query;
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
  }

  if (req.method === 'GET') {
    // console.log(req)
    if (req.url === '/') {
      res.writeHead(200, headers);
      res.direction = messageQueue.dequeue();
      res.end(res.direction);
      next();
    } else if (req.url === '/background.jpg') {
      console.log(req.url)
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {

        if (err) {
          res.writeHead(404, headers);
        } else {
          res.writeHead(200, {
            'Content-Type': 'image/jepg',
            'Content-Length': data.length
          });
          res.write(data, 'binary');
        }
        res.end();
        next();
      })
    }
  }

  if (req.method === 'POST' && req.url === '/background.jpg') {
    var imageData = Buffer.alloc(0);

    req.on('data', (chunk) => {
      imageData = Buffer.concat([imageData, chunk])
    });
    req.on('end', () => {
      var image = multipart.getFile(imageData)
      fs.writeFile(module.exports.backgroundImageFile, image.data, (err) => {
        res.writeHead(err ? 400 : 201, headers);
        res.end();
        next()
      })
    });
  }



  // invoke next() at the end of a request to help with testing!
};


    // else if (parsedUrl.action === 'image') {
    //   // case for success - we have background.jpg, 200
    //   fs.access(this.backgroundImageFile, fs.constants.F_OK, (err) => {
    //     res.writeHead(404, headers);
    //     console.log('error');
    //     res.end('No such image');
    //   })
    // } else {
    //   res.writeHead(200, headers);
    //   console.log('this is the content variable')
    //   res.end(content);
    // }