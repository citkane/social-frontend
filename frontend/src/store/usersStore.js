/* eslint-disable no-param-reassign */
/* global io  */
import eventBus from '@/plugins/eventBus';

export default {
    namespaced: true,
    state: {
        loggedInUser: false,
        users: {}
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
        logOut() {
            Object.keys(this.state).forEach((module) => {
                if (module !== 'users') this.dispatch(`${module}/cleanUp`);
            });
            this.dispatch('users/cleanUp');
            eventBus.$emit('user-logged-out');
        },
        logIn(context, user) {
            this.$api.http.get('/login/', { params: user })
                .then((response) => {
                    context.commit('loggedInUser', response.data);
                    localStorage.user = JSON.stringify(user);
                    const socket = io(`/${response.data.uid}`, { path: '/ws' });
                    this.$api.setSocket(socket);
                    Object.keys(this.state).forEach((module) => {
                        this.dispatch(`${module}/populate`);
                    });
                    eventBus.$emit('user-logged-in', user);
                })
                .catch((err) => {
                    eventBus.$emit('user-logged-in-error', err);
                });
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
            users[user.uid] = user;
            context.commit('users', { ...users });
        },
        updateUser(context, user) {
            const { users } = context.state;
            users[user.uid] = user;
            context.commit('users', { ...users });
        },
        deleteUser(context, user) {
            const { users } = context.state;
            delete users[user.uid];
            context.commit('users', { ...users });
        },
        populate() {
            const { socket } = this.$api;
            socket.on('users.user-created', (user) => {
                this.dispatch('users/addUser', user);
            });
            socket.on('users.user-updated', (user) => {
                this.dispatch('users/updateUser', user);
            });
            socket.on('users.user-deleted', (user) => {
                this.dispatch('users/deleteUser', user);
            });
            this.dispatch('users/getAllUsers');
        },
        cleanUp(context) {
            const { socket } = this.$api;
            socket.off('users.user-created');
            socket.off('users.user-updated');
            socket.off('users.user-deleted');
            localStorage.removeItem('user');
            context.commit('loggedInUser', false);
            context.commit('users', {});
            socket.disconnect();
            this.$api.setSocket(false);
        }
    }
};
