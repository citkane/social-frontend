
/**
 * ## The user frontend.
 * 
 * This is a <a href="https://vuejs.org/" target="_blank">Vue</a> project scaffolding using <a href="https://cli.vuejs.org/" target="_blank">Vue cli 3</a>.
 * 
 * It implements the <a href="https://vuetifyjs.com/en/" target="_blank">Vuetify</a> material design component framework.
 * @module frontend
 */

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
