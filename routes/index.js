const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (error, user) => {
        if (error) {
            console.log(error);
            return res.render('register')
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }) ,(req, res) => {
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('error', 'Logged out.');
    res.redirect('/campgrounds');
});

module.exports = router;