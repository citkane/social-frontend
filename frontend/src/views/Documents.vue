<template>
    <page-layout>
        <v-container fluid class="pa-0">
            <div class='header'>
                <v-btn @click="back()" small :disabled="!history.length">Back</v-btn>
                <div>{{ location}}</div>
            </div>
            <iframe class="d-flex grow" src="/docs/" @load.prevent="updateLocation" ref="docs" />
        </v-container>
    </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout';

export default {
    name: 'Documents',
    components: {
        PageLayout
    },
    data() {
        return {
            location: '/docs/',
            newLocation: '/docs/',
            history: []
        };
    },
    methods: {
        updateLocation() {
            if (this.location === this.$refs.docs.contentWindow.location.pathname) return;
            this.location = this.$refs.docs.contentWindow.location.pathname;
            this.history.push(this.location);
        },
        back() {
            if (this.$refs.docs.contentWindow.location.pathname
            === this.history[this.history.length - 1]) {
                this.history.pop();
            }
            this.$refs.docs.contentWindow.location.pathname = this.history.pop() || '/docs/';
        }
    },
    computed: {
        docSrc() {
            if (this.$refs.docs) return this.$refs.docs.src;
            return '/';
        }
    },
    mounted() {
    }
};
</script>
<style lang="scss" scoped>
.container {
    height:100%;
}
iframe {
    width:100%;
    height:100%;
    border: none;
    padding-top: 50px;
}
.header {
    display: flex;
    align-items: center;
    position:fixed;
    background: white;
    width: 100%;
    height:50px;
}
</style>

