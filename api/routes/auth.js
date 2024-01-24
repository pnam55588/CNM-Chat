const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validations/auth');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.json({ error: error.details[0].message + 'debug' });

    const checkEmailExist = await User.findOne({ email: req.body.email });
    if(checkEmailExist) return res.json({ error: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    })

    try{
        const newUser = await user.save();
        await res.send(newUser);
    }catch(err){
        await res.status(400).send(err);
    }

});   

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(422).json({ error: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(422).json({ error: 'Email or password is wrong' });

    const checkPassword = await bcrypt.compare(req.body.password, user.password);

    if(!checkPassword) return res.status(422).json({ error: 'Email or password is wrong' });
    //set isOnline to true

    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    res.header('auth-token', token).json({ token: token, user: user });
    
});    


module.exports = router;