<template>
    <v-app>
        <v-navigation-drawer app clipped
            width=200
            v-model="drawer">
                <v-list v-if="loggedInUser">
                    <v-list-tile :to="`/people`">
                        <v-list-tile-title>People</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile :to="`/activities`">
                        <v-list-tile-title>Social Activities</v-list-tile-title>
                    </v-list-tile>
                </v-list>
                <v-divider />
                <v-list dense>
                    <v-list-tile :to="`/dev`">
                        <v-list-tile-title class="grey--text">Documentation</v-list-tile-title>
                    </v-list-tile>
                </v-list>
                <v-divider />
            </v-navigation-drawer>
        <v-toolbar app clipped-left dark color="light-green darken-1">
            <v-btn icon to="/">
                <v-icon small>$vuetify.icons.home</v-icon>
            </v-btn>
            <v-btn v-if="loggedInUser" small icon @click.stop="drawer = !drawer">
                <v-icon small>$vuetify.icons.menu</v-icon>
            </v-btn>
            <v-toolbar-title class="headline text-uppercase">
                <span>Social</span>
            </v-toolbar-title>
            <v-spacer />
            <v-toolbar-items>
                <user-actions />
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <v-toolbar v-if="toolbar" dense>
                <v-toolbar-title><slot name="toolbarTitle"></slot></v-toolbar-title>
                <v-spacer />
                <v-toolbar-items><slot name="toolbarActions"></slot></v-toolbar-items>
            </v-toolbar>
            <slot></slot>
        </v-content>
    </v-app>
</template>
<script>
import { mapState } from 'vuex';
import UserActions from '@/components/common/UserActions';

export default {
    name: 'PageLayout',
    components: {
        UserActions
    },
    props: {
        toolbar: {
            type: Boolean
        }
    },
    data() {
        return {
            drawer: true
        };
    },
    computed: {
        ...mapState('users', {
            loggedInUser: state => state.loggedInUser
        })
    }
};
</script>
<style lang="scss" scoped>
</style>
