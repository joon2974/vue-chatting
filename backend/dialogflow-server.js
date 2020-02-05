const dialogflow = require('dialogflow');
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//User들의 집합(users), 관리자 알림을 다르게 표시하기 위해 key 코드로 admin 설정
var users = [];
const admin = 'ThisIsAdminKeyCode'
const projectId = 'make-bike-assignment-reopsi'
const chatBot = 'ThisIsChatBotCode'

//dialogflow에 요청할 때 보낼 request 형식에 맞추어 object반환
function makeRequest(sessionPath, message){
    return {
        session: sessionPath,
        queryInput: {
            text: {
              text: message,
              languageCode: 'ko',
            },
          },
    }
}

//dialogflow에 요청하고 해당 결과값을 반환
async function getResponse(sessionClient, request){
    const responses = await sessionClient.detectIntent(request);
    return await responses[0].queryResult;
}

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function(req,res){
    res.sendFile('Hello!!');
});

io.on('connection', function (socket) {
    console.log(`Socket Id ${socket.id} is connected`);

    //하단에서 user가 'ChatBot' 이라는 채팅룸에 접속했을 때만 Session을 생성하기 위해 미리 선언
    let sessionId;
    let sessionClient;
    let sessionPath;

    //MainPage.vue에서 Nickname과 Room Number를 입력하면 'createUser' emit -> UserList에 해당 유저의 정보 push
    //User 정보: name, id, room을 포함
    socket.on('createUser', function(user){
        user.id = socket.id;
        users.push(user);
        console.log(`user name <${user.name}> created`);
        console.log(`current users: ${users.map(v =>v.name)}`);
    })

    //Chat.vue의 created에서 'joinRoom'을 emit -> 해당 socket을 room 정보에 join시키고
    //해당 room에 속한 user들에게 신규 유저의 접속을 알림: 'updateUsers'는 클라이언트 측 Vuex의 users를 update
    //'newMessage'는 client측의 messages를 update -> 채팅 내용이 화면에 나타남
    socket.on('joinRoom', user => {

        if(user.room === 'ChatBot'){
            console.log(`user <${user.name}> joined ChatBot room`);

            //User가 ChatBot 채팅 룸에 들어오면 Session을 생성한다.
            sessionId = socket.id;
            sessionClient = new dialogflow.SessionsClient();
            sessionPath = sessionClient.sessionPath(projectId, sessionId);

            const hello = makeRequest(sessionPath, '안녕');
            getResponse(sessionClient, hello)
                .then((result) => {
                    console.log("response from chat-bot: ", result.fulfillmentText);
                    socket.emit('newMessage', {name:chatBot, msg: result.fulfillmentText});
                })
                .catch((err) => {
                    console.log(err);
                });

        }else{
            console.log(`user <${user.name}> joined room <${user.room}>`);

            const userList = users.filter(v => v.room === user.room)

            socket.join(user.room);
            io.to(user.room).emit('updateUsers', userList)
            socket.broadcast.to(user.room).emit('newMessage', {name: admin, msg: `${user.name} is joined on channel!`})
        }
    })

    //chatting을 입력했을 때 'chat' 이 emit됨 -> 해당 유저가 속한 방의 모든 user에게 메시지를 보냄
    //정확히는 socket으로 newMessage를 전송하여 Vuex의 mutataion을 통해 state를 변경
    //callback은 client측 코드를 참조(input창을 비우는 것)
    socket.on('chat', function(data){
        const user = users.find(v => v.id === data.id);

        if(user.room === 'ChatBot'){
            //해당 msg를 보낸 User가 ChatBot 채팅룸에 있다면 Dialogflow에 msg를 전달하고
            //챗봇은 굳이 다른사람의 msg를 보여줄 필요가 없으므로 socket.emit을 통해 1:1로 msg를 보낸다

            //바로 하단의 emit은 원래는 room에 msg를 emit하므로 자신의 메시지도 표시되었는데
            //socket.emit을 하면 자신이 send한 메시지가 보이지 않아 서버단에서 한번 더 보내준다.
            socket.emit('newMessage', {name: user.name, id: user.id, msg: data.msg});

            const query = makeRequest(sessionPath, data.msg);

            getResponse(sessionClient, query)
                .then((result) => {
                    console.log("response from chat-bot: ", result.fulfillmentText);
                    socket.emit('newMessage', {name:chatBot, msg: result.fulfillmentText});
                })
                .catch((err) => {
                    console.log(err);
                });
        }else{           
            console.log(`user <${user.name}> send message to room <${user.room}>: ${data.msg}`);

            if(user){
                io.to(user.room).emit('newMessage', {name: user.name, id: data.id, msg: data.msg})
                console.log('send to room: ', user.room)
            }
        }
        
    });

    //연결이 끊어졌을 때, Users를 갱신하고 해당 socket을 leave를 통해 제거
    //해당 유저의 room에 속한 모든 user에게 갱신 사실을 알림.
    socket.on('disconnect', function() {
        const leaveUser = users.find(v => v.id === socket.id)
        if(leaveUser){
            console.log('user disconnected: ' + leaveUser.name);
            users = users.filter(v => v.id !== socket.id)
            console.log("current users: ", users.map(v => v.name));

            if(leaveUser.room === 'ChatBot'){
                console.log(`${leaveUser.name} leave the ChatBot system.`);
                sessionId = '';
                sessionClient = null;
                sessionPath = null;
            }else{
                socket.leave(leaveUser.room)
                io.to(leaveUser.room).emit('updateUsers', users.filter(v => v.room === leaveUser.room))
                io.to(leaveUser.room).emit('newMessage', {name: admin, msg: `${leaveUser.name} leaved chat room ${leaveUser.room}`})
            }
        }
      });
})

server.listen(3001, function(){
    console.log('socket io server on port 3001!')
})