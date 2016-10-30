const fs = require('fs');

const entryPath = __dirname + '/../../entry/docs/';
const tempMarkdownFile = __dirname + '/../views/temp.md';
const pathTo = name => entryPath + '/' + name + '.md'

const lookupContent = name => {
  if (typeof name !== 'string') {
    throw new Error('The name of the content to lookup is bad');
  } else if (!fs.existsSync(pathTo(name))) {
    throw new Error('The content file to look up does not exist');
  }

  return fs.readFileSync(pathTo(name), { encoding: 'utf-8' });
};

const setupContent = content => {
  if (typeof content != 'string') {
    throw new Error('The type of this content cannot be used for a blog entry');
  }

  fs.writeFileSync(tempMarkdownFile, content);
  return true;
}

module.exports = {
  lookupContent,
  setupContent
}