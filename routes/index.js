const express = require('express');
const router = express.Router();
const User = require('../models/User')
const rateLimit = require('express-rate-limit')

router.get('/', (req, res) => {
    res.send("Home");
});

router.get('/allUsers', (req, res) => {
    User.find().then(data => {
        res.send(data);
    }).catch(err => {
        res.send({message: err})
    });
});

router.post('/addUser', (req, res) => {
    const user = new User({
        username: req.body.username,
        credentials: new Buffer(req.body.username + " " + req.body.password).toString("base64")
    });
    user.save().then(data => {
        res.json(data);
    }).catch(err => {
        res.json({message: err})
    });
});

//BONUS
const apiRequestLimiter = rateLimit({
    windowMs: 60000,
    max: 1,
    handler: (req, res) => {
        return res.status(429).json({
            error: "Only one request per minute allowed"
        })
    }
})

router.use('/notification', apiRequestLimiter);

router.post('/notification', (req, res) => {
    User.find({
        credentials: req.body.credentials
    }).then(data => {
        const nowDate = new Date().toISOString()
        if (data.length === 1) {
            res.json({
                message: {
                    "name": "Email Notification",
                    "status": "Delivered",
                    "createdAt": nowDate
                }
            });
        } else {
            res.json({
                message: {
                    "name": "Email Notification",
                    "status": "Not delivered",
                    "createdAt": nowDate
                }
            });
        }
    }).catch(err => {
        res.json({message: err})
    });
});

module.exports = router;
