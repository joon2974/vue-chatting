<template>
<v-content>
    <v-container>
      <v-layout align-center justify-center>
        <v-flex xs12 sm10 md10>
          <v-card>
            <v-card-title>
              <h1>Welcome to OpenCareLab's Chatting Service!</h1><br>
            </v-card-title>
            <v-card-text>
              <h3>Please input your chat nickname and chat room's name.</h3>
              <h5>If you want to use chat-bot service, input 'ChatBot' on room name.</h5>
            </v-card-text>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
                <v-text-field
                  v-model="name"
                  :counter="16"
                  :rules="nameRules"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="room"
                  :rules="roomRules"
                  label="Enter the room"
                  required
                ></v-text-field>
                <v-btn :disabled="!valid" color="primary" class="mr-4" type="submit">Go to chat</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import store from '../store'
import {mapMutations} from 'vuex'

export default{
    head: {
        title: 'Chat Log-in'
    },
    data() {
        return{
            valid: true,
            name: "",
            id: null,
            nameRules: [
                v => !!v || "Name is required",
                v => (v && v.length <= 16) || "Name must be less than 16 characters"
            ],
            room: "",
            roomRules: [v => !!v || "Enter the room name"],
        }
    },
    methods: {
      ...mapMutations(['setUser']),
        submit(){
            if(this.$refs.form.validate()){
                const user = {
                    name: this.name,
                    room: this.room,
                    id: this.$socket.id,
                };
                this.$socket.emit('createUser', user);
                store.commit('setUser', user);
                this.$router.push('/chat');
            }
        },
    },
}
</script>