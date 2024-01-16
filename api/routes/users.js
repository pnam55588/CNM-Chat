const express = require('express');
const User = require('../models/User');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, async (req, res) => {
    User.find({}).then(function(users){
        res.json(users);
    })
});

module.exports = router;