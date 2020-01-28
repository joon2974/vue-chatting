var amqp = require('amqp');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var rabbitMq = amqp.createConnection({ host: 'localhost' });

const ex = 'vue-web-socket';
const admin = 'ThisIsAdminKeyCode';
var users = [];
var connlist = [];

//amqp connection error management, local의 rabbitMQ 서버를 키지 않으면 에러 발생
rabbitMq.on('error', function(e){
    console.log(e);
})

rabbitMq.on('ready', function(){
    io.on('connection', function(socket){

        //Login page에서 Nickname과 room number를 입력하면 createUser를 emit한다.
        //Parameter user{name: -, id: -, room: -}
        socket.on('createUser', function(user){
            user.id = socket.id;
            //Server측 유저 목록에 해당 user를 push
            users.push(user);

            console.log("\nuser pushed in room No. ", user.room);
            console.log("유저 목록: ", users)

            //message를 publish하기 위한 exchange를 생성
            try{
                if(!socket.exchange){
                    socket.exchange = rabbitMq.exchange(ex, {type: 'topic',autoDelete: false,durable: false,exclusive: false,confirm: true});
                    console.log("exchange 생성", socket.exchange.name)
                }
            }catch(err){
                console.log("Could not create connection to RabbitMQ. \nStack trace -->" + err.stack);
            }
            //User disconnection시 제거하기 위해 ctag를 미리 생성
            connlist[user.id] = {ctag:null, conn: socket};
        })

        //User가 Nickname과 room을 정해서 로그인을 하면 Chat.vue에서 careated단계에 joinRoom을 emit
        socket.on('joinRoom', function(user){
            console.log("\nuser joined: ", user.room);
            //해당 user와 같은 방에 속한 userlist를 userList에 저장
            const userList = users.filter(v => v.room === user.room);

            //해당 socket을 room에 join 시킨 후, 방에 속한 user들에게 information 전달
            socket.join(user.room);
            io.to(user.room).emit('updateUsers', userList);
            socket.broadcast.to(user.room).emit('newMessage', {name: admin, msg: `${user.name} is joined on channel!`})

            //subscribe할 queue를 생성
            if(!socket.q){
                socket.q = rabbitMq.queue(ex + user.id, {durable: true, autoDelete: false, exclusive: false}, 
                    function(){
                        //exchange와 queue 바인딩(연결)
                        socket.q.bind(socket.exchange, ex + user.id);
                        //publish 된 내용(rabbitMsg)를 받아 type에 따라 socket을 통해 메시지 전달
                        socket.q.subscribe(function(rabbitMsg){
                            if(rabbitMsg.type === 'newMessage'){
                                io.to(user.room).emit('newMessage', {name: rabbitMsg.name, id: rabbitMsg.id, msg: rabbitMsg.msg});
                            }
                            if(rabbitMsg.type === 'leaveMessage'){
                                io.to(rabbitMsg.room).emit('newMessage', {name: rabbitMsg.name, msg: rabbitMsg.msg})
                            }
                        }).addCallback(function(ok){
                            //connection list에 저장.
                            connlist[socket.id].ctag = ok.consumerTag;
                        })
                    })
            }
        })

        //채팅을 하고 enter를 치거나 입력을 했을 때, 'chat'을 emit
        socket.on('chat', function(data, callback){
            //Userlist에서 해당 user를 찾는다
            const user = users.find(v => v.id === data.id);

            if(user){
                //exchange를 통해 메시지를 publish -> subscribe할 때에는 {}의 내용을 rabbitMsg로 받게 된다.(상단 참조)
                socket.exchange.publish(ex + user.id, {type: 'newMessage', name: user.name, id: data.id, msg: data.msg});
                console.log('\nsend to room: ', user.room)
            }

            //클라 측에서 보낸 콜백을 실행(input창 비우기)
            callback();
        })

        //연결이 끊어졌을 때
        socket.on('disconnect', function() {
            const leaveUser = users.find(v => v.id === socket.id)

            if(leaveUser){
                console.log('\nuser disconnected: ' + leaveUser.name);

                //UserList에서 해당 유저를 제거
                users = users.filter(v => v.id !== socket.id)

                console.log("current users", users);

                //Client측으로 해당 유저의 접속 종료 정보를 전달
                io.to(leaveUser.room).emit('updateUsers', users.filter(v => v.room === leaveUser.room))
                socket.exchange.publish(ex + leaveUser.id, {type: 'leaveMessage', name: admin, room: leaveUser.room, msg: `${leaveUser.name} leaved chat room ${leaveUser.room}`});
                
                //connection List에서 해당 연결 정보를 제거하고, subscribe 해제
                try{
                    if(connlist[socket.id]){ 
						socket.q.unsubscribe(connlist[socket.id].ctag);
						delete connlist[socket.id].ctag;
				  	}
                      delete connlist[socket.id];
                      socket.disconnect();
                }catch (er) {
                    console.log(":::::::: Exception Socket (ON-Disconnect) ::::::::>>>>>>> " + er.stack);
                }
            }
          });
    })
})

server.listen(3001, () => console.log("Server is on port 3001!"));