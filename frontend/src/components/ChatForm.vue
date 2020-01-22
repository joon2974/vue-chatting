<template>
    <v-form @submit.prevent="sendMessage">
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
</template>

<script>

export default {
    data(){
        return{
            message: ''
        }
    },
    props:['user'],
    methods: {
        sendMessage(){
            if(this.message.length){
                this.$socket.emit('chat',
                 {msg: this.message, id: this.user.id},
                  resetMessage => { this.message = ''})
            }
        },
    },
    watch: {
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
#inputText{
    width: 400px;
}
</style>