const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/../../assets'));

app.get('/', (req, res) => {
    res.render('index', { title: 'le index' });
});

app.get('/post/:name', (req, res) => {
    res.status(200).send(req.params.name);
});

app.listen(3000, () => {
    console.warn('listening on localhost:3000');
});