/* eslint-disable no-param-reassign */

import eventBus from '@/plugins/eventBus';

function listeners(socket, store) {
    socket.on('users.user-created', (user) => {
        store.dispatch('users/addUser', user);
    });
    socket.on('users.user-updated', (user) => {
        store.dispatch('users/updateUser', user);
    });
    socket.on('users.user-deleted', (user) => {
        store.dispatch('users/deleteUser', user);
    });
}
function killListeners(socket) {
    socket.off('users.user-created');
    socket.off('users.user-updated');
    socket.off('users.user-deleted');
}

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
            killListeners(this.$api.socket);
            context.commit('loggedInUser', false);
            context.commit('users', []);
            eventBus.$emit('user-logged-out');
        },
        logIn(context, user) {
            context.commit('loggedInUser', user);
            eventBus.$emit('user-logged-in', user);
            listeners(this.$api.socket, this);
            this.dispatch('users/getAllUsers');
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
