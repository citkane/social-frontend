/* global io  */
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import ApiInterface from './ApiInterface';

Vue.prototype.$socket = io({ path: '/ws' });
Vue.prototype.$api = new ApiInterface(Vue);
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

Vue.prototype.$socket.on('doggy.dog', (data) => {
    console.log(data);
});
Vue.prototype.$socket.on('getUser', (callBack) => {
    callBack({
        userId: 'xxxx',
        userName: 'Michael Jonker'
    });
});
