//rabbitmq 서버에 접속(호스트, 포트, user, password, vhost 등을 지정할수 있습니다.)
var connec = amqp.createConnection({ host: 'localhost'
                                       , port: 5673
                                       , login: 'guest'
                                       //, password: 'quest'
                                       , vhost: '/'
                                         });
var io = require('socket.io');
var socketioserver = io.listen(app);
var _subscriptions = {};  //접속한 queue와 consumerTag를 저장하여 클라이언트 접속이 끊겼을때 unsubscribe 할수 있도록 합니다.
 
//socket.io 클라이언트가 접속할때 http://host/pub으로 연결(connection) 이벤트 발생시
socketioserver.of("/pub").on('connection', function(connection) {    
    sys.p("pub on connection");
          //rabbitmq의 exchage를 생성합니다. exchageName = node-conn-share1, exchangeType = topic
    var exchange1 = connec.exchange('node-conn-share1', {type: 'topic'});
    connection.on('disconnect', function(){ //socket.io 클라이언트의 접속이 끊어졌을때 할일을 정의
        sys.p("disconnect");
    });
          // 클라이언트에서 send()를 했을때 할일을 정의
    connection.on('message', function(msg){
                    //클라이언트에서 json.send()로 json형태로 보냅니다.
        sys.p("message : " + msg.message + ", routingKey : " + msg.routingKey );
                   //exchage에 클라이언트에서 보낸 routingKey와 message를 세팅해서 publish 합니다.
        exchange1.publish(msg.routingKey, msg.message, {contentType: 'text/plain'});
    });
});
 
socketioserver.of("/sub").on('connection', function(connection) {
    sys.p("sub on connection");
    var exchange1 = connec.exchange('node-conn-share1', {type: 'topic'});
 
    connection.on('bindQueue', function(opt){
        sys.p('bindQueue routingKey : ' + opt.routingKey);
        //queueName은 rabbitmq server가 자동으로 생성, durable=false, autoDelete=false
        var q1 = connec.queue('', { durable: false, autoDelete: false }, function(){
            //queue와 exchange를 바인딩하며 이때 exchange에서 routingKey에 해당하는 내용만 받도록 함
            q1.bind(exchange1, opt.routingKey);
            //바인딩이 완료가 되었을때 실행
            q1.on('queueBindOk', function() {
                sys.p("Queue " + q1.name + " is open");
                //queue에서 메세지를 받아 전송하도록 하며 1개씩 받아와 성공시 ack를 보내는 방식으로 한다.
                q1.subscribe({ ack: true, prefetchCount: 1},
                    function (m, headers, deliveryInfo) {
                        sys.p("subscribe : " + m.data.toString());
                        sys.p(deliveryInfo.deliveryTag + " : "+ deliveryInfo.routingKey + " : " + m.contentType);
                        //routingKey와 msg를 json으로 묶어서 보낸다.
                        var msg = {routingKey: deliveryInfo.routingKey, msg: m.data.toString()};
                        connection.emit('data', msg); //클라이언트에 보냄
                        q1.shift() //다음 메시지 받아오기
                }).addCallback(function(ok) {
                    sys.p("subscribe callback ok : " + ok.consumerTag);
                    //connection.sessionId에서 만든 queue와 consumerTag를 기억
                    _subscriptions[connection.id] = {'queue': q1, 'consumerTag': ok.consumerTag};
                });
            });
        });
    });
    //클라이언트 연결이 끊겼을때
    connection.on('disconnect', function(){
        sys.p("disconnect");
        var id = connection.id;
        var sub = _subscriptions[id];
        //_subscriptions에서 지우고
        delete _subscriptions[id];
        //해당 queue에 consumerTag에 해당하는 consumer가 더이상 soubscribe 하지 않도록 명시적으로 선언
        sub.queue.unsubscribe(sub.consumerTag); 
        sub.queue.destroy(); //해당 queue를 삭제한다.
        sys.p("unsubscribe " + id + ", " + sub.queue.name + ", " + sub.consumerTag);
    });
});
 
app.get('/sub', routes.sub);
app.get('/pub', routes.pub);