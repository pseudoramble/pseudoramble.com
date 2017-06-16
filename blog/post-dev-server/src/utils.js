const fs = require('fs');

module.exports = function(filename) {
  fs.writeFileSync('../data/redirects.map', `/blog /blog/entry/${filename}.html`, { encoding: 'utf-8' });
};