const express          = require('express'),
      app              = express(),
      bodyParser       = require('body-parser'),
      port             = 3000,
      mongoose         = require('mongoose'),
      flash            = require('connect-flash'),
      passport         = require('passport'),
      localStrategy    = require('passport-local'),
      methodOverride   = require('method-override');
      Campground       = require('./models/campground'),
      Comment          = require('./models/comment'),
      User             = require('./models/user'),
      seedDB           = require('./seeds'),
      commentRoutes    = require('./routes/comments'),
      campgroundRoutes = require('./routes/campgrounds'),
      indexRoutes      = require('./routes/index');

// seedDB();
mongoose.connect('mongodb://localhost:27017/canopy', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(port, () => console.log(`Server started at port ${port}.`));