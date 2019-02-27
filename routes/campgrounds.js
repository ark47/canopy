const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const middleware = require('../middleware');

router.get('/campgrounds', (req, res) => {
    Campground.find({}, (error, campgrounds) => {
        if (error) {
            console.log(error)
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds, currentUser: req.user})
        }
    });
});

router.post('/campgrounds', middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = { name: name, price: price, image: image, description: desc, author: author }
    Campground.create(newCampground, (error, newlyCreated) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

router.get('/campgrounds/new', middleware.isLoggedIn, (req, res) => {
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

router.get('/campgrounds/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
        Campground.findById(req.params.id, (error, foundCampground) => {
            res.render('campgrounds/edit', {campground: foundCampground});
        });
});

router.put('/campgrounds/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (error, updatedCampground) => {
        if (error) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});

router.delete('/campgrounds/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, error => {
        if (error) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;