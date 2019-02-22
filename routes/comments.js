const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');

router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (error, campground) => {
        if (error) {
            console.log(error);
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
});

router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;