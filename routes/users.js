var express = require('express');
var router = express.Router();
// node core module, construct query string
const qs = require('querystring');



// generates a random string for the
const randomString = require('randomstring');

// makes sending requests easy
const request = require('request');
var user = require('./../schema/user');


var config = require('./../github.json');

console.log("client id: ", config.clientId);


/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('req: ', req.body);
    console.log('req query: ', req.query);
    
    // GET request to get emails
  // this time the token is in header instead of a query string
  request.get(
    {
      url: 'https://api.github.com/user/public_emails',
      headers: {
        Authorization: 'token ' + req.session.access_token,
        'User-Agent': 'Login-App'
      }
    },
    (error, response, body) => {
     console.log("body email: ", body);
        var bodyInfo = body.substring(1, body.length-1);
        var bodyJson = JSON.parse(bodyInfo);
        console.log("body email: ", );
        console.log("body email: ", bodyJson.email
                   
                   );
      user.find({email: bodyJson.email}, function(err, userDet){
          if(err){
              res.send('database issue');
             }
          console.log("user det: ", userDet.length);
          if(userDet && userDet.length == 0){
                var user_info = {
                      email: bodyJson
                    
                    
                    .email
                  };
                  console.log("user info: ", user_info);
                  var userref = new user(user_info);
                  console.log("post: ", userref);
                // Save the

              
              
              


                userref.save(function (err) {
                  if (err) {
                      console.log("err: ", err);
                      return res.send('could not create account');
                  }
                  // saved!
                  res.send(
                    "<p>You're logged in! Here's all your emails on GitHub: </p>" +
                    body +
                    '<p>Go back to <a href="/">log in page</a>.</p>'
                  );
                });  
             }else{
                 res.send(
                    "<p>You're logged in! Here's all your emails on GitHub: </p>" +
                    body +
                    '<p>Go back to <a href="/">log in page</a>.</p>'
                  );
             }
      });    
        
        
        
      
    }
  );
    
});

router.get('/login', (req, res, next) => {
    // generate that csrf_string for your "state" parameter
  req.session.csrf_string = randomString.generate();
    // construct the GitHub URL you redirect your user to.
    // qs.stringify is a method that creates foo=bar&bar=baz
    // type of string for you.
  //const redirect_uri = process.env.HOST + '/redirect';
  const redirect_uri = 'http://localhost:3000' + '/redirect';
  console.log('redirect url: ', redirect_uri);
  const githubAuthUrl =
    'https://github.com/login/oauth/authorize?' +
    qs.stringify({
      client_id: config.clientId,
      redirect_uri: redirect_uri,
      state: req.session.csrf_string,
      scope: 'user:email'
    });
  // redirect user with express
  res.redirect(githubAuthUrl);
});


router.all('/redirect', (req, res) => {
  // Here, the req is request object sent by GitHub
  console.log('Request sent by GitHub: ');
  console.log(req.query);
    
});

router.post('/create', function(req, res, next) {
  
  
})

module.exports = router;
