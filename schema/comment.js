// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var commentSchema = new Schema({
  postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
  comment: String,
  commentedBy:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  commentId:  {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var Comment = mongoose.model('Comment', commentSchema);

// make this available to our users in our Node applications
module.exports = Comment;
