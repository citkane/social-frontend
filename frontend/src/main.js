import Vue from 'vue';
import './plugins/axios';
import './plugins/vuetify';
import App from './App';
import router from './router';
import store from './store';
import ApiInterface from '@/plugins/ApiInterface';
import eventBus from '@/plugins/eventBus';
import '@/assets/global.css';

// eslint-disable-next-line no-new
new ApiInterface(Vue, store);

try {
    const user = JSON.parse(localStorage.user);
    if (user) store.dispatch('users/logIn', user);
} catch (err) {
    localStorage.removeItem('user');
    router.push('/');
}


Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
