const express = require('express');
const fs = require('fs');
const moment = require('moment');

const { lookupContent, setupContent } = require('./src/content.js');
const { afoot, before, after } = require('./src/entryHunter.js');
const { toLink } = require('./src/transformers.js');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/../../assets'));

app.get('/', (req, res) => {
  res.render('index', { title: 'le index' });
});

app.get('/post/:name', (req, res) => {
  const entryName = req.params.name;
  const content = lookupContent(entryName);
  const contentStored = setupContent(content);

  const afootEntry = afoot(entryName);
  const previousEntries = before(entryName).map(toLink);

  const publishedDate = moment(afootEntry.created).format('YYYY-MM-DD');
  const modifiedDate = moment().format('YYYY-MM-DD');

  if (contentStored) {
    res.render('entry', { previousEntries, publishedDate, modifiedDate });
  } else {
    res.status(503).send('Content could not setup properly for rendering to occur.');
  }
});

app.listen(3000, () => {
  console.warn('listening on localhost:3000');
});