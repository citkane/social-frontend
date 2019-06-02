<template>
  <v-container fluid>
    <router-link to="/about">about</router-link>
    <v-btn @click="downloadImage">Image</v-btn>
    <v-layout>
      <img src="img/cat.jpg" />
    </v-layout>
  </v-container>
</template>

<script>
export default {
    methods: {
        downloadImage() {
            this.$api.image.download('http://allergicliving.com/wp-content/uploads/2015/02/cat2.jpg');
        }
    }
};
</script>
