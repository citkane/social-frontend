import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import People from './views/People.vue';
import Person from './views/Person.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/people',
            component: People
        },
        {
            path: '/people/:uid',
            component: Person
        }

    ]
});
