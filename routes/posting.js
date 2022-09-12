const express = require("express")
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/assignment');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const { body, validationResult } = require('express-validator');
const user = require("../models/user");
const post = require("../models/post")
var jwt = require('jsonwebtoken');
const { route } = require("./register");
const secret = "SECRET"
const router = express.Router()
router.use(bodyParser.json())

//get all the posts
router.get("/", async(req,res)=>{
    const data = await post.find();
    res.status(200).json({
        posts : data
    })
})

//create a post for logged in User
router.post("/", async(req, res)=>{
    const data = await post.create(req.body)
    res.status(201).json({
        data
    })
})

//edit the post
router.put("/:postId", async(req,res)=>{
    const findUser = await post.findOne({_id:req.params.postId});
    if(findUser === null){
        return res.status(400).json({
            status:"Failed",
            message : "no user found"
        })
    }
    else{
        const findUser = await post.updateOne({_id: req.params.postId}, req.body);
        res.status(200).json({
            status  : "Success",
            message : "Updated Successfully",
            findUser
        })
    }
})

//delete the post
router.delete("/:postId", async(req,res)=>{
    const findUser = await post.findOne({_id:req.params.postId});
    if(findUser === null){
        return res.status(400).json({
            status:"Failed",
            message : "no user found"
        })
    }
    else{
        const findUser = await post.deleteOne({_id: req.params.postId}, req.body);
        res.status(200).json({
            status  : "Success",
            message : "Deleted Successfully"
        })
    }
})

module.exports = router