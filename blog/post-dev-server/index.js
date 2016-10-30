const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    console.warn('le index');
    res.render('index', { title: 'le index' });
});

app.get('/post/:name', (req, res) => {
    console.warn(`name = ${req.params.name}`);
    res.status(200).send(req.params.name);
});

app.listen(3000, () => {
    console.warn('listening on localhost:3000');
});