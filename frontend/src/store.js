import Vue from 'vue';
import Vuex from 'vuex';

//Vue랑 Vuex 연결
Vue.use(Vuex);

export const SET_USER = 'SET_USER'
// export const NEW_MESSAGE = 'NEW_MESSAGE'

export default new Vuex.Store({
    state: {
        chips: ['chip1', 'chip2', 'chip3', 'chip4', 'chip5', 'chip6', 'chip7', 'chip8', 'chip9', 'chip10'],
        cards: [
                { title: 'Pre-fab homes', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 12 },
                { title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 6 },
                { title: 'Best airlines', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 6 },
            ],
        messages: [],
        user: {},
        users: []
    },
    mutations: {
        [SET_USER](state, user){
            state.user = user;
        },
        newMessage(state, msg){
            state.messages = [...state.messages, msg]
        },
        updateUsers(state, users){
            state.users = users
        }
    }
})
