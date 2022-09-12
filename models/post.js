const mongoose= require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title : {type : String},
    body : {type:String},
    user : {type:String},
    image : {type:Buffer}
})

const post = mongoose.model("post", postSchema)

module.exports = post;