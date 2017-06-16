require('dotenv').config();

const express = require('express');
const fs = require('fs');
const moment = require('moment');
const pug = require('pug');

const { lookupContent, setupContent } = require('./src/content.js');
const { afoot, after, before, latest, save } = require('./src/entryHunter.js');
const { toLink } = require('./src/transformers.js');
const { updateRedirectsMap } = require('./src/utils.js');

const app = express();

const configureEntry = entryName => {
  const content = lookupContent(entryName);
  const contentStored = setupContent(content);

  const afootEntry = afoot(entryName) || { name: entryName, created: new Date().toISOString() };
  const previousEntries = afootEntry.modified ? before(entryName) : latest();
  
  const createdDate = moment(afootEntry.created);

  const publishedDate = createdDate.format('YYYY-MM-DD');
  const modifiedDate = createdDate.isSame(moment(), 'day') ? undefined : moment().format('YYYY-MM-DD');

  return {
    contentStored,
    modifiedDate,
    previousEntries: previousEntries.map(toLink),
    publishedDate
  };
};

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/../../'));

app.get('/', (req, res) => {
  res.render('index', { title: 'le index' });
});

app.get('/post/:name', (req, res) => {
  const { 
    contentStored,
    modifiedDate,
    previousEntries, 
    publishedDate
  } = configureEntry(req.params.name);

  if (contentStored) {
    res.render('commit-to-entry', { name: req.params.name, previousEntries, publishedDate, modifiedDate });
  } else {
    res.status(503).send('Content could not setup properly for rendering to occur.');
  }
});

app.get('/post/:name/commit', (req, res) => {
  const configuredEntry = configureEntry(req.params.name);
  const { 
    modifiedDate,
    previousEntries, 
    publishedDate
  } = configuredEntry;

  const entryContent = pug.renderFile('./views/entry.pug', { 
    name: req.params.name,
    previousEntries,
    publishedDate,
    modifiedDate
  });

  const entrySaved = save(req.params.name, configuredEntry, entryContent);
  updateRedirectsMap(req.params.name);
  
  if (entrySaved) {
    res.render('entry', { 
      name: req.params.name,
      previousEntries,
      publishedDate,
      modifiedDate
    });
  } else {
    res.status(503).send('Content could not setup properly for rendering to occur.');
  }
})

app.listen(3000, () => {
  console.warn('listening on http://localhost:3000');
});