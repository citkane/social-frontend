import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import People from './views/People';
import Person from './views/Person';
import Activities from './views/Activities';
import Activity from './views/Activity';

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
        },
        {
            path: '/activities',
            component: Activities
        },
        {
            path: '/activities/:uid',
            component: Activity
        }

    ]
});
