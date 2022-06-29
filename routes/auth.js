
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
const Users = mongoose.model('Users');

const jwt = require('jsonwebtoken');
const requireLogin = require('../middleware/requireLogin');


router.post("/signup", (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "section cannot be blank" })
    }
    Users.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
            return res.status(200).json({ error: 'the user with same email already exists' });
        }
        bcrypt.hash(password, 12).then((hashedpassword) => {
            const user = new Users({
                name,
                email,
                password: hashedpassword,
                pic
            })
            user.save().then((user) => {
                res.status(200).json({ message: 'saved successfully' });
            }).catch((err) => {
                console.log(err);
                res.status(400).json({ error: 'error occured1' });
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({ error: 'error 2' });
        })
    }).catch(err => {
        console.log(err);
        res.status(400).json({ error: 'error occured3' });
    })
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Email or password can not be blank" });
    }
    Users.findOne({ email: email }).then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid Email or Password1" });
        }
        bcrypt.compare(password, savedUser.password).then(matched => {
            if (matched) {
                const token = jwt.sign({ _id: savedUser._id }, process.env.jwt_secret);
                const { _id, name, email, followers, following, pic } = savedUser;
                res.status(200).json({ token, user: { _id, name, email, followers, following, pic } });
            }
            else {
                res.status(422).json({ error: "Invalid Email or Password" });
            }
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;
