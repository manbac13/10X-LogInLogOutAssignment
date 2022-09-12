const express = require("express")
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/assignment');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const { body, validationResult } = require('express-validator');
const user = require("../models/user");
var jwt = require('jsonwebtoken');
const secret = "SECRET"
const router = express.Router()
router.use(bodyParser.json())

//register the user
router.post("/register", body("name").isAlpha('en-US', { ignore: ' ' }), body("email").isEmail(), body("password").isLength({ min: 5 }), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        bcrypt.hash(req.body.password, parseInt(10), async function (err, hash) {
            // Store hash in your password DB.
            if (err) {
                return res.status(500).json({ status: "Failed", message: err.message });
            }
            else {
                const data = await user.create({
                    name: req.body.name,
                    email:  req.body.email,
                    password:  hash
                });
                res.status(201).json({
                    status: "Success",
                    message: "Registered Successfully",
                    data: data
                })

            }
        });

    } catch (error) {
        res.status(400).json({
            status: "Failed",
            message: error.message
        })
    }
});



//login the user with correct credentials
router.post("/login", body("email").isEmail(), body("password").isLength({ min: 5 }), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const checkUser = await user.findOne({email : req.body.email});
        if(!checkUser){
            return res.status(400).json({
                status: "Failed",
                message: "Invalid User"
            })
        }
        bcrypt.compare(req.body.password, checkUser.password, function(err, result) {
            if(err){
                return res.status(400).json({
                    status : "Failed",
                    message : err.message
                })
            }
            if(result){
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: checkUser.email
                  }, secret);

                  res.status(200).json({
                    status : "Success",
                    message : "Login Successful",
                    token
                })
            }
            else{
                res.status(400).json({
                    status : "Failed",
                    message : "Login Failed, Invalid Credentials"
                })
            }

        });


    } catch (error) {
        res.status(400).json({
            status: "Failed",
            message: error.message
        })
    }
})

module.exports = router