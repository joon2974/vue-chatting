<template>
    <v-content>
        <v-container>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md6>
                    <v-card class="elevation-12" color="grey lighten-5">
                        <v-toolbar dark color="blue-grey darken-3">
                            <v-toolbar-title flat color="blue-grey lighten-4--text">My Chat App</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-chip>{{user.name}}</v-chip>
                        </v-toolbar>
                        <v-card-text>
                            <v-label>Message</v-label>
                            <v-list ref="chats" id="chatText">
                                <message v-for="(msg, index) in messages" 
                                :key="`msg - ${index}`" 
                                :name="msg.name" 
                                :message="msg.msg"
                                :owner="msg.id === user.id"
                                :admin="msg.name === admin"
                                ></message>
                            </v-list>
                        </v-card-text>
                        <v-card-actions>
                            <chat-form :user="user"></chat-form>
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
import ChatForm from './ChatForm'
import MessageComponent from './MessageComponent'
import {mapState} from 'vuex'
import {mapMutations} from 'vuex'
import store from '../store'

export default {
    name: 'Chat',
    data(){
        return{
            admin: 'ThisIsAdminKeyCode'
        }
    },
    components:{
        'chip-group': ChipGroup,
        'card-group': CardGroup,
        'chat-form': ChatForm,
        'message': MessageComponent,
    },
    computed: {
        ...mapState(['chips', 'cards', 'messages', 'user']),
    },
    created() {
       this.$socket.emit('joinRoom', this.user);
    },
    methods: {
        ...mapMutations(['newMessage', 'updateUsers'])
    },
    mounted() {
        this.$socket.on('updateUsers', function(users){
            store.commit('updateUsers', users)
        })
        this.$socket.on('newMessage', function (text) {
            store.commit('newMessage', text)
        })
    },
    watch: {
        messages(){
            // 채팅 출력창을 watch하여 데이터가 갱신될 때마다 스크롤을 맨 아래로 내려준다.
            setTimeout(() => {
                this.$refs.chats.$el.scrollTop = this.$refs.chats.$el.scrollHeight
            }, 0);
        },
    }
}
</script>

<style>
#chatText{
    height: 400px;
    overflow: auto;
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