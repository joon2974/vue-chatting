# Vue를 이용한 간단한 채팅 웹 어플리케이션
## 1. Frontend
1. 프로젝트 시작<br>
    a. vue create [project_name] 명령어로 Vue 기본 틀 생성<br>
    b. vue add vuetify 명령어로 Vue의 UI framework인 vuetify를 프로젝트에 추가함.<br>
    c. 기본 구조의 HelloWorld 컴포넌트 연결 해제 후 Chat(오타나서 Char) 컴포넌트 생성 후 App.vue에 연결<br>
    d. Chat 컴포넌트 구현<br>

2. 프로젝트 구조<br>
    main.js에서 socket.io-client 모듈의 io를 이용하여 3001번 포트로 소켓을 연다.<br>
    a. index.html의 app div를 App.vue 인스턴스로 채워 넣는다.<br>
    b. App.vue 인스턴스에서는 Chat 컴포넌트를 활용한다.<br>
    c. Chat 컴포넌트는 CardGroup, ChipGroup 컴포넌트를 활용.<br>
    d. Chat 컴포넌트에는 기본적인 채팅 UI가 구현되어 있음.<br>
    e. CardGroup은 CardComponent, ChipGroup은 ChipComponent를 활용.<br>
3. 각 Component 설명: 각 vue, js파일의 주석을 참조할 것.
<hr/>

## 2. Backend
    서버는 node.js의 express framework를 이용하여 구현하였으며, 3001번 포트를 이용해 socket 서버를 연다.<br>
1. socket.io<br>
    채팅을 위해 웹소켓을 열기 위한 모듈. Web-socekt 모듈도 존재하지만 그보다 상위버전.<br>
2. socket 이벤트<br>
    기본 이벤트는 'connection', 'disconnect' 이벤트가 있다.
        - connection은 io.on('connection', function(){}) 형태로 받으며 function 내부에 socket을 매개변수로 받을 수 있다.
        - 나머지는 socket.on('이벤트이름', function(){}) 의 형태로 이벤트를 받으며 이벤트 이름은 사용자가 임의로 정하여 클라이언트와 맞춰 통신할 수 있다.<br>
<hr/>

## 3. 실행법
- Backend: backend 폴더에 들어가서 'node server.js' 명령어를 통해 server.js 파일을 실행한다.<br>
 -> 3001번 포트에서 socket 통신을 대기한다.<br>
- Frontend: frontend 폴더에 들어가서 'npm run serve' 명령어를 실행한다.<br>
 -> localhost:8080으로 접속하라는 문구가 나오는데 코드 실행 환경이 AWS ec2환경이므로 인스턴스의 public address인 13.209.40.0:8080으로 접속해야 한다(추후 인스턴스를 껐다 키면 변경될 수 있음).<br>
  -> 같은 주소로 여러 디바이스가 접근 가능하며 채팅시 broadcast되어 모든 사용자가 채팅 내용을 볼 수 있다.<br>
<hr/>

## 4. 향후 개발 방향
1. 사용자별 id를 부여하여 각 사용자를 구별한다.<br>
2. 라우팅을 추가하여 각각의 채팅방을 구성한다(초기 화면에 채팅방 목록 보여주기).<br>
3. RabbitMQ 공부하기.<br>
<hr/>

## 5. 참고 자료
1. 메인 코드 : https://javacpro.tistory.com/72
2. 자잘한 기능들 : https://velog.io/@kay/Vuejs%EB%A1%9C-%EC%B1%84%ED%8C%85%EC%95%B1-%EB%A7%8C%EB%93%A4%EA%B8%B0-6yjnj4u6r6#.srcviewlogin.vue
3. 웹 소켓 : https://m.blog.naver.com/PostView.nhn?blogId=wj8606&logNo=221486758281&proxyReferer=https%3A%2F%2Fwww.google.com%2F
4. vuetify 공식 문서 : https://vuetifyjs.com/ko/components/avatars
5. ui 구조 : https://codepen.io/RayBenefield/pen/gKvagq?editors=1010
6. card, chip group: https://vuetifyjs.com/ko/components/cards
<hr/>

## 6. 2020/01/22 수정사항
1. backend 디렉토리의 server.js 파일 수정하여 사용자별 방을 나누고 각 방별로 메세지를 수신할 수 있게 수정함.
2. front단에서는 vuex, vue-router 도입하여 초기에 사용자 이름과 방 이름을 입력받고 해당 정보를 백단으로 넘겨주어 방을 설정하게 함.
3. 사용자가 채팅창에 chip 혹은 card라고 입력하면 chip 리스트와 card 리스트를 메시지 표시창에 띄워주게 함.(클릭 했을 때의 이벤트는 아직 구현 안했음)
- 향후 추가해야 할 사항: Server단에 rabbitMQ도입, Vuex관련 코드 리펙토링
<hr/>

## 7. 2020/01/28 완료단계 정리
1. 상기 6번의 향후 추가해야 할 사항 반영
    - server.js외에 server-with-amqp.js 파일을 만들어 amqp를 도입한 메시징 서버를 작성함.
    - Vuex관련 코드 리팩토링 완료('../Store에서 직접 store를 import하여 call하는 방식)
2. 프로젝트 실행방법 정리
    - backend 디렉토리 내부에서 rabbitmq server를 실행해줘야 함.(꺼져있다면 sudo service rabbitmq-server restart 명렁어)
    - backend 디렉토리 내부에서 node server-with-amqp.js 명령어 실행 --> 일반 소켓이용 서버는 node server.js 명령어만 실행하면 됨.
    - frontend 디렉토리 내부에서 npm run serve 명령어 실행
    - 현재 AWS ec2 서버에 파일이 올라가 있으므로 13.209.40.0:8080으로 접속하면 Chat login화면이 나옴.
3. 프로젝트 코드 구조
    - frontend 폴더(Vue cli 이용하여 프로젝트 생성, vuetify를 이용하여 UI를 구성 / Vuex, Vue-router 도입)
    - backend 폴더(socket.io만을 사용하여 만든 메시징 서버인 server.js와 amqp를 도입하여 수정한 server-with-amqp.js 파일이 있음)
4. RabbitMQ 도입시 참고 소스코드
    - https://github.com/gujc71/rabbitMQ_Sample 의 step1 코드: server.amqp-2.js
    - https://teragoon.wordpress.com/2012/03/07/nodejs-rabbitmq-messag/ : server-amqp.js
    - RabbitMQ 서비스 구조: https://devahea.github.io/2019/04/30/AMQ-%EB%AA%A8%EB%8D%B8%EA%B3%BC-Exchange-Queue-Binding-%EC%97%90-%EB%8C%80%ED%95%B4/
    - RabbitMQ 서버: https://kamang-it.tistory.com/entry/AMQPRabbitMQRabbitMQ%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0%EC%99%80-%EC%84%A4%EC%B9%98%EB%B0%A9%EB%B2%95-1?category=799882, http://abh0518.net/tok/?p=384
5. 각 코드에 대한 설명은 주석을 참조할 것