var express = require('express');
var router = express.Router();
var user_stats_controller = require('../controllers/userStatsController');

router.get('/', function(req, res) {
  res.render('index', { title: 'MyAnimeStats' });
});

router.post('/user-stats', user_stats_controller.post_user);

module.exports = router;
