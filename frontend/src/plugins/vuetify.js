import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
    iconfont: 'fa',
    icons: {
        user: 'fas fa-user',
        menu: 'fas fa-bars',
        home: 'fas fa-home',
        edit: 'far fa-edit'
    }
});
