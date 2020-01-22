var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var users = [];
const admin = 'ThisIsAdminKeyCode'

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function(req,res){
    res.sendFile('Hello!!');
});

io.on('connection', function (socket) {
    console.log('Connect from Client: '+socket.id)

    socket.on('createUser', function(user){
        user.id = socket.id;
        users.push(user);
        console.log(users,"user pushed");
    })

    socket.on('joinRoom', user => {
        console.log("user joined: ", user.room)
        const userList = users.filter(v => v.room === user.room)

        socket.join(user.room);
        io.to(user.room).emit('updateUsers', userList)
        socket.broadcast.to(user.room).emit('newMessage', {name: admin, msg: `${user.name} is joined on channel!`})
    })

    socket.on('chat', function(data, callback){
        const user = users.find(v => v.id === data.id);
        console.log(data.msg, 'data from Client');
        console.log(user, 'user data');
        console.log(data, 'received data');
        
        if(user){
            io.to(user.room).emit('newMessage', {name: user.name, id: data.id, msg: data.msg})
            console.log('send to room: ', user.room)
        }

        callback()
    });

    socket.on('disconnect', function() {
        const leaveUser = users.find(v => v.id === socket.id)
        if(leaveUser){
            console.log('user disconnected: ' + leaveUser.name);
            socket.leave(leaveUser.room)
            users = users.filter(v => v.id !== socket.id)
            console.log(" current users", users);
            io.to(leaveUser.room).emit('updateUsers', users.filter(v => v.room === leaveUser.room))
            io.to(leaveUser.room).emit('newMessage', {name: admin, msg: `${leaveUser.name} leaved chat room ${leaveUser.room}`})
        }
      });
})

server.listen(3001, function(){
    console.log('socket io server on port 3001!')
})