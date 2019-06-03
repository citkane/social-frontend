<template>
  <v-container fluid>
    <router-link to="/about">about</router-link>
    <v-btn @click="testImage">Image</v-btn>
    <v-btn @click="createUser">New User</v-btn>
    <v-layout>
      <img src="img/cat.jpg" />
    </v-layout>
  </v-container>
</template>

<script>
export default {
    methods: {
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
            this.$api.create('users.newUser', { userName: 'New User' })
                .then((data) => {
                    console.log(data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }
};
</script>
