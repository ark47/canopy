const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');

router.get('/campgrounds', (req, res) => {
    Campground.find({}, (error, campgrounds) => {
        if (error) {
            console.log(error)
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds, currentUser: req.user})
        }
    });
});

router.post('/campgrounds', isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = { name: name, image: image, description: desc, author: author }
    Campground.create(newCampground, (error, newlyCreated) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

router.get('/campgrounds/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec((error, foundCampground) => {
        if (error) {
            console.log(error);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;