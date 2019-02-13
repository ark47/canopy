const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    const campgrounds = [
        { name: 'Salmon Creek', image: '/images/camp_1.jpg' },
        { name: 'Granite Hill', image: '/images/camp_2.jpg' },
        { name: 'Mountain Goat\'s Rest', image: '/images/camp_3.jpg' },
    ];
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(port, () => console.log(`Server started at port ${port}.`));