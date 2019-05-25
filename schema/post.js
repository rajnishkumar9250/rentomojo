// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var postSchema = new Schema({
  posts: String,
  postedBy:  {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

// the schema is useless so far
// we need to create a model using it
var Post = mongoose.model('Post', postSchema);

// make this available to our users in our Node applications
module.exports = Post;
