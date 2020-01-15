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
        this.$socket.on('chat', (data) => {
            this.textarea.push(data)
        })
    },
    watch: {
        textarea(){
            setTimeout(() => {
                this.$refs.chats.$el.scrollTop = this.$refs.chats.$el.scrollHeight
            }, 0);
        },
        message(){
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