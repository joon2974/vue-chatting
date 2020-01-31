# 1. 실행 방법
1. backend 폴더에서 npm i
2. frontend 폴더에서 npm i
3. backend에서 rabbitMQ를 이용한 server-with-amqp.js를 실행하기 위해서는 rabbitMQ 서버가 필요하므로 rabbitMQ를 다운로드 후 실행.
	- Ubuntu: sudo apt-get install rabbitmq-server
	- Window: erlang 설치 후, rabbitMQ 설치 -> 참고 https://yuda.dev/159
4. frontend 폴더에서 npm run serve
5. backend 폴더에서 node server-with-amqp.js
	- server.js는 socket.io만을 사용해서 구현한 서버
	- 그 외 두 개의 js파일은 참고용
6. Chrome 창 두 개 띄운 후 각각 localhost:8080으로 접속
7. 서로 다른 닉네임과 같은 방번호를 입력 후 입장
