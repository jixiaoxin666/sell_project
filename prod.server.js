/**
 * Created by abby on 2017/9/1.
 */
// 新添加文件 小型http server
var express = require('express');
var config = require('./config/index');

// config.build.port指的是 config=>index.js build下的port 如果没有就需添加
var port = process.env.PORT || config.build.port;
var app = express();
var router = express.Router();
router.get('/', function(req, res, next) {
  req.url = '/index.html';
  next();
});
app.use(router);

// 异步接口的router
// 跟build=>dev-server.js中一致
var appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();
apiRoutes.get('/seller', function(req, res) {
  res.json({
    errno: 0,
    data: seller
  });
});
apiRoutes.get('/goods', function(req, res) {
  res.json({
    errno: 0,
    data: goods

  });
});
apiRoutes.get('/ratings', function(req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
});
app.use('/api', apiRoutes);
//

app.use(express.static('./dist'));

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://' + port);
});
