const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (error, campground) => {
        if (error) {
            console.log(error);
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
});

router.post('/campgrounds/:id/comments', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (error, campground) => {
        if (error) {
            console.log(error);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (error, comment) => {
                if (error) {
                    console.log(error);
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentsOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (error, foundComment) => {
        if (error) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    })
});

router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentsOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (error, updatedComment) => {
        if (error) {
            res.redirect('back');
        } else {
            console.log(req.params.id)
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentsOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, error => {
        if (error) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;