/* global io  */
import Vue from 'vue';
import './plugins/axios';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import ApiInterface from '@/plugins/ApiInterface';
import eventBus from '@/plugins/eventBus';
import '@/assets/global.css';

const api = new ApiInterface(Vue, store);

function logIn(user) {
    Vue.prototype.$http.get('/login/', { params: user })
        .then((response) => {
            store.dispatch('users/logIn', response.data);
        })
        .catch((err) => {
            eventBus.$emit('user-logged-in-error', err);
        });
}
eventBus.$on('logOut', () => {
    localStorage.removeItem('user');

    store.dispatch('users/logOut');
});

eventBus.$on('user-logged-out', () => {
    api.socket.disconnect();
    api.setSocket(false);
});

eventBus.$on('logIn', (loginForm) => {
    logIn(loginForm);
});

eventBus.$on('user-logged-in', (user) => {
    localStorage.user = JSON.stringify(user);
    const socket = io(`/${user.uid}`, { path: '/ws' });
    api.setSocket(socket);
});

try {
    if (localStorage.user) logIn(JSON.parse(localStorage.user));
} catch (err) { localStorage.removeItem('user'); }


Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
