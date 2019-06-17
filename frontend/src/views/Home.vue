<template>
    <page-layout>
    <v-container fluid>
        <router-link to="/about">about</router-link>
    </v-container>
    </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout';

export default {
    name: 'Home',
    components: {
        PageLayout
    }
};
</script>
