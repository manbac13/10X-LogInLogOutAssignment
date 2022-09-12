const express = require("express")
const registerRoute = require("./routes/register")
const postRoute = require("./routes/posting")
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/assignment');
var jwt = require('jsonwebtoken');
const secret = "SECRET"
const app = express();

//authenticate the user by verifying the token
app.use("/posts", (req, res, next) => {
    try {
        const token = req.headers.authorization?.split("Test ")[1];
        next()
        // if taken is present then
        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if(err){
                    return res.status(400).json({
                        status: "Failed",
                        message: err.message
                    })
                }
                else{
                    const user = decoded.data;
                    console.log(user)
                }
            });
        }

    } catch (error) {
        res.status(400).json({
            status: "Failed",
            message: error.message
        })
    }
})

app.use("/", registerRoute)
app.use("/posts", postRoute)

app.listen(3000, () => {
    console.log("Server running at port 3000")
})