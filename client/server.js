var WebSocketServer = require('ws').Server
<<<<<<< HEAD
 , http = require('http')
 , express = require('express')
 , app = express()
 , morgan = require('morgan')
 , bodyParser = require('body-parser');
=======
  , http = require('http')
  , express = require('express')
  , app = express()
  , morgan = require('morgan')
  , bodyParser = require('body-parser');
>>>>>>> 25beb2ab3db8f0c7c2b5d18b8c5e82ff9a894c1b

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/app'));

var server = http.createServer(app);
server.listen(8000);

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
<<<<<<< HEAD
 var id = setInterval(function() {
   ws.send(JSON.stringify(process.memoryUsage()), function() { /* ignore errors */ });
 }, 100);
 console.log('started client interval');
 ws.on('close', function() {
   console.log('stopping client interval');
   clearInterval(id);
 });
=======
  var id = setInterval(function() {
    ws.send(JSON.stringify(process.memoryUsage()), function() { /* ignore errors */ });
  }, 100);
  console.log('started client interval');
  ws.on('close', function() {
    console.log('stopping client interval');
    clearInterval(id);
  });
>>>>>>> 25beb2ab3db8f0c7c2b5d18b8c5e82ff9a894c1b
});