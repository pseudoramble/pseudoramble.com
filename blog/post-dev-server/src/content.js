const fs = require('fs');

const documentPath = `${__dirname}/../data/docs/`;
const tempMarkdownFile = `${documentPath}/__temp.md`;
const pathTo = name => `${documentPath}/${name}.md`;

const lookupContent = name => {
  if (typeof name !== 'string') {
    throw new Error('The name of the content to lookup is bad');
  } 
  
  const markdownFile = pathTo(name);

  if (!fs.existsSync(pathTo(name))) {
    fs.appendFileSync(markdownFile, '# Your next entry');
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