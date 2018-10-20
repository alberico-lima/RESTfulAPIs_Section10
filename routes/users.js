const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

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

    const token = jwt.sign({_id:user._id}, config.get('jwtPrivateKey'));
    res.header('x-auth_token',token).send(_.pick(user,['_id','name','email']));
    //res.send(_.pick(user,['_id','name','email']));
});

module.exports = router;