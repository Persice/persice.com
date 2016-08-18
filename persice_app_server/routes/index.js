var express = require('express');
var router = express.Router();

router.get('/auth/facebook/callback', function(req, res, next) {
  res.send('');
});

/* GET home page */
router.get('/*', function(req, res, next) {
  res.render('index', { title: 'Persice', layout: 'layout' });
});

/* POST FB login */
router.post('/auth/facebook', function(req, res, next) {
  // console.log('User authenticated:', req);
  // Send fake JWT token
  res.send({token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2IzNjJjNWJmOGU5YTkzMzAxYjNiNjMiLCJpYXQiOjE0NzEzNzkxMzMsImV4cCI6MTQ3MjU4ODczM30.zzqDY0yLUfGuQ6v7PpwdJSvLCrg56moDf6-JRIOUwfM'});
});



module.exports = router;
