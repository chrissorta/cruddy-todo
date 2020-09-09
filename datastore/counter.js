const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);
const writeFilePromise = Promise.promisify(fs.writeFile);
var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {

  readFilePromise(exports.counterFile).then(fileData =>
    callback(null, Number(fileData)))
    .catch(err => callback(err, null));
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  writeFilePromise(exports.counterFile, counterString)
    .then(() => callback(null, counterString))
    .catch((err) => { throw ('error writing counter'); });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (cb) => {
  readCounter((err, counter) => {
    if (err) {
      console.log(err);
    } else {
      writeCounter(counter + 1, (err, counter) => {
        if (err) {
          console.log(err);
        } else {
          cb(null, counter);
        }
      });
    }
  });
};




// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
