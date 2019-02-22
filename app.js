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
      seedDB     = require('./seeds'),
      commentRoutes = require('./routes/comments'),
      campgroundRoutes = require('./routes/campgrounds'),
      indexRoutes = require('./routes/index');

seedDB();
mongoose.connect('mongodb://localhost:27017/canopy', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(require('express-session')({
    secret: 'Secret.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(port, () => console.log(`Server started at port ${port}.`));