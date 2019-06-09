/* global io  */
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import ApiInterface from '@/assets/ApiInterface';
import eventBus from '@/assets/eventBus';
import '@/assets/global.css';

function listeners(socket) {
    socket.on('users.user-created', (user) => {
        store.dispatch('users/addUser', user);
    });
    socket.on('users.user-updated', (user) => {
        store.dispatch('users/updateUser', user);
    });
    socket.on('users.user-deleted', (user) => {
        store.dispatch('users/deleteUser', user);
    });
}

Vue.prototype.$socket = io({ path: '/ws', autoConnect: false });
Vue.prototype.$socket.connect();
Vue.prototype.$socket.emit('user-logged-in', { userId: 1 }, (foo) => {
    store.dispatch('users/getAllUsers');
    listeners(Vue.prototype.$socket);
});

eventBus.$on('user-logged-out', () => {
    // Vue.prototype.$socket.close();
});

eventBus.$on('user-logged-in', (user) => {
    // Vue.prototype.$socket.open();
});
const api = new ApiInterface(Vue);
store.$api = api;
Vue.prototype.$api = api;
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
