const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);
const readDirPromise = Promise.promisify(fs.readdir);
const writeFilePromise = Promise.promisify(fs.writeFile);
const unlinkPromise = Promise.promisify(fs.unlink);
const getNextUniqueIdPromise = Promise.promisify(counter.getNextUniqueId);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  getNextUniqueIdPromise().then(id =>
    writeFilePromise(`${exports.dataDir}/${id}.txt`, text)
      .then(() => callback(null, { id, text }))
      .catch(err => callback(err, null)))
    .catch(err => console.log(err));
};

exports.readAll = (callback) => {

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
  readFilePromise(`${exports.dataDir}/${id}.txt`)
    .then(data => callback(null, { id, text: data.toString() }))
    .catch(error => callback(error));
};

exports.update = (id, text, callback) => {
  readFilePromise(`${exports.dataDir}/${id}.txt`).then(data =>
    writeFilePromise(`${exports.dataDir}/${id}.txt`, text).then(() =>
      callback(null, { id, text: text.toString() })
    ).catch(error => callback(error))
  ).catch(err => callback(new Error(`No item with id: ${id}`)));
};

exports.delete = (id, callback) => {
  readFilePromise(`${exports.dataDir}/${id}.txt`)
    .then(data => unlinkPromise(`${exports.dataDir}/${id}.txt`)
      .then(() => callback())
      .catch(error => callback(error)))
    .catch(() => callback(new Error(`No item with id: ${id}`)));
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
