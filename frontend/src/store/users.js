/* eslint-disable no-param-reassign */
import eventBus from '@/assets/eventBus';

export default {
    namespaced: true,
    state: {
        loggedInUser: false,
        users: []
    },
    mutations: {
        loggedInUser(state, user) {
            state.loggedInUser = user;
        },
        users(state, users) {
            state.users = users;
        }
    },
    actions: {
        logOut(context) {
            context.commit('loggedInUser', false);
        },
        logIn(context, user) {
            context.commit('loggedInUser', user);
        },
        getAllUsers(context) {
            this.$api.read('users.users')
                .then((users) => {
                    context.commit('users', users);
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        addUser(context, user) {
            const { users } = context.state;
            users.push(user);
            console.log(users);
            context.commit('users', users);
        },
        updateUser(context, updatedUser) {
            const users = context.state.users.map((user) => {
                if (user.uid === updatedUser.uid) return updatedUser;
                return user;
            });
            context.commit('users', users);
        },
        deleteUser(context, user) {
            const users = context.state.users.filter(u => u.uid !== user.uid);
            context.commit('users', users);
        }
    }
};
