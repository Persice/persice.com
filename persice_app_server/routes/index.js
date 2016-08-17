var express = require('express');
var router = express.Router();

// Mock api response
router.get('/api/*', function (req, res) {
  res.send({});
});

/* GET home page */
router.get('/*', function(req, res, next) {
  // console.log('User-Agent: ' + req.headers['user-agent']);
  res.render('index', { title: 'Persice' });
});

/* POST FB login */
router.post('/auth/facebook', function(req, res, next) {
  // console.log('User authenticated:', req);
  // Send fake JWT token
  res.send({token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1N2IzNjJjNWJmOGU5YTkzMzAxYjNiNjMiLCJpYXQiOjE0NzEzNzkxMzMsImV4cCI6MTQ3MjU4ODczM30.zzqDY0yLUfGuQ6v7PpwdJSvLCrg56moDf6-JRIOUwfM'});
});

module.exports = router;
