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