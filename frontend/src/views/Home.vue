<template>
    <page-layout>
    <v-container fluid>
        <router-link to="/about">about</router-link>
        {{ loggedInUser }}
        <v-btn @click="testImage">Image</v-btn>
        <v-btn @click="createUser">New User</v-btn>
        <v-btn @click="logOut">logout</v-btn>
        <v-layout>
        <img src="img/cat.jpg" width="600px"/>
        </v-layout>
    </v-container>
    </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout.vue';
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Home',
    components: {
        PageLayout
    },
    data() {
        return {

        };
    },
    methods: {
        ...mapActions('users', [
            'logOut',
            'getAllUsers'
        ]),
        testImage() {
            this.$api.read('images.test', 'http://allergicliving.com/wp-content/uploads/2015/02/cat2.jpg')
                .then((data) => {
                    console.log(data);
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        createUser() {
            this.$api.create('users.user', { userName: 'New User' })
                .then((data) => {
                    console.log(data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    },
    computed: {
        ...mapState('users', {
            loggedInUser: state => state.loggedInUser
        })
    },
    created() {
        this.getAllUsers();
    }
};
</script>
