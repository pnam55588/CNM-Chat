const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validations/auth');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.json({ error: error.details[0].message + 'debug' });

    const checkPhoneExist = await User.findOne({ phone: req.body.phone });
    if(checkPhoneExist) return res.json({ error: 'Phone already exists' });

    const checkIdExist = await User.findById(req.body.phone);
    if(checkIdExist) return res.json({ error: 'Id already exists' });


    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    try{
        const user = new User({
            _id: req.body.phone, 
            name: req.body.name,
            phone: req.body.phone,
            password: hashPassword,
        })
        const saveUser = await user.save();
        const token = jwt.sign({_id:saveUser._id}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.header('auth-token', token).json({ token: token, user: saveUser });
    }catch(err){
        res.status(400).send(err);
    }
});   

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(422).json({ error: error.details[0].message });

    const user = await User.findOne({ phone: req.body.phone });
    if(!user) return res.status(422).json({ error: 'Phone or password is wrong' });

    const checkPassword = await bcrypt.compare(req.body.password, user.password);
    if(!checkPassword) return res.status(422).json({ error: 'phone or password is wrong' });
    //set isOnline to true

    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    res.header('auth-token', token).json({ token: token, user: user });
    
});    


module.exports = router;