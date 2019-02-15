const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      port       = 3000,
      mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost/canopy');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create({
//         name: 'Mountain Goat\'s Rest',
//         image: '/images/camp_3.jpg'
//     }, (error, campground) => {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('New campground');
//             console.log(campground);
//         }
//     });

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (error, campgrounds) => {
        if (error) {
            console.log(error)
        } else {
            res.render('campgrounds', {campgrounds: campgrounds})
        }
    })
});

app.post('/campgrounds', (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = { name: name, image: image }
    Campground.create(newCampground, (error, newCampground) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.listen(port, () => console.log(`Server started at port ${port}.`));