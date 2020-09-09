const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);
const readDirPromise = Promise.promisify(fs.readdir);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('error: ', err);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          console.log('error; ', err);
        } else {
          callback(null, { id, text });
        }
      });
    }


  });

};

exports.readAll = (callback) => {
  // fs.readdir(exports.dataDir, (err, files) => {
  //   if (err) {
  //     console.log('error: ', err);
  //   } else {

  readDirPromise(exports.dataDir).then(files => {
    data = files.map(file => {
      return readFilePromise(`${exports.dataDir}/${file}`).then(fileData => {
        var id = path.basename(file, `.txt`);
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });
    Promise.all(data).then(item => callback(null, item));
  }
  );


};


exports.readOne = (id, callback) => {
  //var text = items[id];
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data.toString() });
    }
  });

};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          console.log(err);
        } else {

          callback(null, { id, text: text.toString() });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
        if (err) {
          console.log(err);
        } else {

          callback();
        }
      });
    }
  });


};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
