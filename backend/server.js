var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function(req,res){
    res.sendFile('Hello!!');
});

io.on('connection', function (socket) {
    console.log('Connect from Client'+socket)

    socket.on('chat', function(data){
        console.log(data, 'data from Client');

        // client로 부터 받은 message를 id와 결합하여 object 형태로 저장 후 모든 사용자에게 broadcast 해준다.
        var rtnMessage = {
            id: data.id,
            message: data.message
        };

        socket.broadcast.emit('chat', rtnMessage);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected: ' + socket);
      });

})

server.listen(3001, function(){
    console.log('socket io server on port 3001!')
})