const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    const token = req.header('auth-token');
    if(!token) return res.status(401).json({ error: 'Access Denied' });
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    } catch (err) {
        return response.status(400).send('Invalid Token');
    }
}