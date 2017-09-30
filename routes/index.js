var express = require('express');
var router = express.Router();
var index_controller = require('../controllers/indexController');

router.get('/', function(req, res) {
  res.render('index', { title: 'MyAnimeStats' });
});
router.post('/', index_controller.post_user);

module.exports = router;