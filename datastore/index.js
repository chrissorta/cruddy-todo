const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('error: ', err);
    } else {
      data = files.map(file => {
        var id = path.basename(file, '.txt');

        return {id, text: id};
        // fs.readFile(`${exports.dataDir}/${file}`, (err, data) => {
        //   if (err) {
        //     return console.log('error: ', err);
        //   } else {
        //     return callback(null, {id: file, text: file});
        //   }
        // });
      });
      callback(null, data);
      // let data = files.map(file => {
      //   return fs.readFile(`${exports.dataDir}/${file}`, (err, data) => {
      //     if (err) {
      //       return console.log('error: ', err);
      //     } else {
      //       return {
      //         id: file.slice(0, -4),
      //         text: file.slice(0, -4)
      //       };
      //     }
      //   });
      // });
    }
  });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
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
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

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
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
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
