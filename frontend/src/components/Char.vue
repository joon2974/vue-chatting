<template>
    <v-content>
        <v-container>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md6>
                    <v-card class="elevation-12" color="grey lighten-5">
                        <v-toolbar dark color="blue-grey darken-3">
                            <v-toolbar-title flat color="blue-grey lighten-4--text">My Chat App</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-chip>{{id}}</v-chip>
                        </v-toolbar>
                        <v-card-text>
                            <v-label>Message</v-label>
                            <v-list ref="chats" id="chatText">
                                <template v-for="(text, index) in textarea">
                                    <v-list-item v-if="text" :key="index">
                                        <v-list-item-action>
                                            <v-avatar color="indigo" size="36">
                                                <span class="white--text">{{text.id}}</span>
                                            </v-avatar>
                                        </v-list-item-action>
                                        <v-list-item-content>
                                            <v-textarea rows='1' row-height='10' auto-grow solo disabled :value="text.message"></v-textarea>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>
                            </v-list>
                        </v-card-text>
                        <v-card-actions>
                            <v-form @submit.prevent="sendMessage()">
                                <v-label>Your message</v-label>
                                <v-row>
                                    <v-col>
                                        <v-textarea id="inputText" rows='1' auto-grow solo placeholder="input your message..." v-model="message" @keydown.13="sendMessage" ref="chatLine"></v-textarea>
                                    </v-col>
                                    <v-col>
                                        <v-btn color="blue-grey lighten-4" type="submit">Send</v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-actions>
                        <v-divider></v-divider>
                        <chip-group :chipList="chips"></chip-group>
                        <v-divider></v-divider>
                        <card-group :cardList="cards"></card-group>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
import ChipGroup from './ChipGroup'
import CardGroup from './CardGroup'

export default {
    name: 'Chat',
    components:{
        'chip-group': ChipGroup,
        'card-group': CardGroup
    },
    data(){
        return{
            textarea: [],
            message: '',
            id: 'joon',
            chips: ['chip1', 'chip2', 'chip3', 'chip4', 'chip5', 'chip6', 'chip7', 'chip8', 'chip9', 'chip10'],
            cards: [
                { title: 'Pre-fab homes', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 12 },
                { title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 6 },
                { title: 'Best airlines', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 6 },
            ],
        }
    },
    methods: {
        sendMessage(){
            // send 버튼이나 엔터키를 누르면 입력이 없으면 동작하지 않고,
            // 소켓에 채팅 id와 message를 object 형태로 전달한 후, 자신의 채팅 표시창에도 내용을 표시해준다.
            if(this.message.length === 0) return false;
            else{
                this.$socket.emit('chat', {
                    id: this.id,
                    message: this.message
            });

            this.textarea.push({id:this.id, message: this.message})
            this.message = ''
            this.$refs.chatLine.focus()
            }
        }
    },
    created() {
        // DOM 생성 이전에 socket으로부터 받은 메시지를 데이터에 추가해준다.
        // $socket은 main.js에서 선언했음.
        this.$socket.on('chat', (data) => {
            this.textarea.push(data)
        })
    },
    watch: {
        textarea(){
            // 채팅 출력창을 watch하여 데이터가 갱신될 때마다 스크롤을 맨 아래로 내려준다.
            setTimeout(() => {
                this.$refs.chats.$el.scrollTop = this.$refs.chats.$el.scrollHeight
            }, 0);
        },
        message(){
            // 채팅 입력창에 엔터가 같이 들어가는 현상이 발생하여 엔터가 들어가 있으면 채팅 입력창을 비워준다.
            setTimeout(() => {
                if(this.message === '\n'){
                    this.message = ''
                }
            })
        }
    }
}
</script>

<style>
#chatText{
    height: 400px;
    overflow: auto;
}
#inputText{
    width:400px;
}
@media screen and (max-width: 959px){
    #inputText{
        width:300px;
    }
}
.elevation-12{
    margin-top: 30px;
}
</style>