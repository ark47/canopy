const Campground = require('../models/campground');
const Comment = require('../models/comment');

let middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (error, foundCampground) => {
            if (error) {
                res.redirect('back');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    res.send('You do not have permission to do that.');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

middlewareObj.checkCommentsOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (error, foundComment) => {
            if (error) {
                res.redirect('back');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.send('You do not have permission to do that.');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = middlewareObj