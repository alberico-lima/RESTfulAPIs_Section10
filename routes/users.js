const auth = require('./../midleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req,res) => {
    console.log(req.user._id);
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get('/', async (req,res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email});
    if (user) {
        console.log('email:',req.body.email);
        console.log(user);
        return res.status(400).send('User already registered..');
    }

    user = new User({
        name: req.body.name,
        email: req.body.email

    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password,salt);
   

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth_token',token).send(_.pick(user,['_id','name','email']));
    //res.send(_.pick(user,['_id','name','email']));
});

module.exports = router;