const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('@/lib/models/User')


module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ error: 'You must be signed in.' })
    };

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must belogged in.' })
        };

        const { userId } = payload;
        const user = await User.findById(userId);
        req.user = user;
        next();
    });


}