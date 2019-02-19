const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      port       = 3000,
      mongoose   = require('mongoose'),
      passport   = require('passport'),
      localStrategy = require('passport-local'),
      Campground = require('./models/campground'),
      Comment    = require('./models/comment'),
      User       = require('./models/user'),
      seedDB     = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost:27017/canopy', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (error, campgrounds) => {
        if (error) {
            console.log(error)
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds})
        }
    })
});

app.post('/campgrounds', (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description
    let newCampground = { name: name, image: image, description: desc }
    Campground.create(newCampground, (error, newCampground) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((error, foundCampground) => {
        if (error) {
            console.log(error);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

//::::::::::::COMMENTS ROUTE::::::::::::://

app.get('/campgrounds/:id/comments/new', (req, res) => {
    Campground.findById(req.params.id, (error, campground) => {
        if (error) {
            console.log(error);
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
});

app.post('/campgrounds/:id/comments', (req, res) => {
    Campground.findById(req.params.id, (error, campground) => {
        if (error) {
            console.log(error);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (error, comment) => {
                if (error) {
                    console.log(error);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

app.listen(port, () => console.log(`Server started at port ${port}.`));