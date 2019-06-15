import Vue from 'vue';
import Vuex from 'vuex';
import users from '@/store/usersStore';
import activities from '@/store/activitiesStore';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        users,
        activities
    }
});
