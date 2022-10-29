//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/tasktwoDB");

let app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const postSchema = new mongoose.Schema({
  email:String,
  name:String,
  subject:String,
  message:String,
  query:String
});

const Post = mongoose.model("Post",postSchema);
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
})
app.get("/explore",function(req,res){
  Post.find({},function(err,posts){
    res.render("explore",{posts:posts});
  });
});
app.get("/compose",function(req,res){
  res.render("compose");
});
app.post("/compose",function(req,res){
  const post= new Post({
    email:req.body.email,
    name:req.body.name,
    subject:req.body.subject,
    message:req.body.message,
    query:req.body.query
  });
  post.save(function(err){
    if(!err){
      res.redirect("/explore");
    }
  });
});
app.get("/posts/:postId",function(req,res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id:requestedPostId},function(err,post){
    res.render("post",{
      email:post.email,
    name:post.name,
    subject:post.subject,
    message:post.message,
    query:post.query
    });
  });
  });
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
