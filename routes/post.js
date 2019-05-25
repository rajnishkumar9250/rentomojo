var express = require('express');
var router = express.Router();
var post = require('./../schema/post');
console.log("post: ", post);
var comment = require('./../schema/comment');
console.log("comment: ", comment);

var post = require('./../schema/post');


/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

router.post('/create', function(req, res, next) {
    console.log("body: ", req.body);
  console.log("post: ", post);
  var post_info = {
      posts:  req.body.post,
      postedBy: req.body.userid
  };
  var postref = new post(post_info);
  console.log("post: ", postref);
// Save the
    
    
    
    postref.save(function (err) {
      if (err) return handleError(err);
      // saved!
      res.send('respond with a resource');
    });
});

router.post('/reply', function(req, res, next) {
    console.log("body: ", req.body);
  console.log("post: ", post);
  var comment_info = {
      comment: req.body.comment,
      commentId:  req.body.commentId,
      postId: req.body.postId,
      commentedBy: req.body.userid
  };
  var commentref = new comment(comment_info);
  console.log("post: ", commentref);
// Save the
    
    
    
    commentref.save(function (err) {
      if (err) return handleError(err);
      // saved!
      res.send('comment saved');
    });
});

router.put('/edit', function(req, res, next) {
    console.log("body: ", req.body);
  console.log("post: ", post);
  var comment_info = {
      comment: req.body.comment,
      commentId:  req.body.commentId
  };
  
    comment.findOneAndUpdate({commentedBy: req.body.commentedBy}, {$set: comment_info},  function (err) {
      if (err) return handleError(err);
      // saved!
      res.send('comment saved');
    });
});

router.get("/list", function(req, res){
    //res.render('index', { title: 'Express' });
    console.log("userid: ", req.query.userid);
    post.find({postedBy: req.query.userid}, function(err, postList){
        if(err){
           res.json({message: "could not fetch post"});
        }
        res.json({post: postList});
    });
    
    
    
});



module.exports = router;
