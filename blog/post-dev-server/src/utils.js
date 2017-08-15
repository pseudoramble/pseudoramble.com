const fs = require('fs');

module.exports = {
  updateRedirectsMap: function(filename) {
    fs.writeFileSync(__dirname + '/../data/redirects.map', `/blog /blog/entry/${filename}.html;`, { encoding: 'utf-8' });
  }
};