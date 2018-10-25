var app = require('express')();
var cors = require('cors');
app.use(cors());
var http = require('http').Server(app);

var io = require('socket.io')(http);

var userId = 1;
var usersPool = [];
var messagesQuantity = 500;

app.get('/login', function(req, res){
  res.json({userId});
  userId++;
});

io.on('connection', function(socket){
  usersPool.push({ userId: socket.handshake.query.userId, id: socket.id });
  console.log(usersPool);
  for (var i = 0; i < messagesQuantity; i++) {
    socket.emit('message', `userId${socket.handshake.query.userId} - message${i}`);
  }
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
