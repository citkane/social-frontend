<template>
    <v-app>
        <v-navigation-drawer app clipped
            v-if="loggedInUser"
            width=200
            v-model="drawer">
                <v-list>
                    <v-list-tile :to="`/people`">
                        <h3>People</h3>
                    </v-list-tile>
                    <v-list-tile :to="`/activities`">
                        <h3>Social Activities</h3>
                    </v-list-tile>
                </v-list>
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
