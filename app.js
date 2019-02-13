const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let campgrounds = [
    { name: 'Salmon Creek', image: '/images/camp_1.jpg' },
    { name: 'Granite Hill', image: '/images/camp_2.jpg' },
    { name: 'Mountain Goat\'s Rest', image: '/images/camp_3.jpg' },
];

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = { name: name, image: image }
    campgrounds.push(newCampground);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.listen(port, () => console.log(`Server started at port ${port}.`));