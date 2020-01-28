import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Main from './components/MainPage.vue'
import Chat from './components/Chat.vue'
const NotFound = {template: '<div><h1>404 Page not Found!</h1></div>'}

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: Main},
        {path: '/chat', component: Chat},
        {path: '*', component: NotFound}
    ]
})

export default router;