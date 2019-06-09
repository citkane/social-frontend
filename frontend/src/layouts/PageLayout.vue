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
                </v-list>
            </v-navigation-drawer>
        <v-toolbar app clipped-left dark color="#7DC24F">
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
                <v-btn small flat v-if="!loggedInUser">LogIn</v-btn>
                <v-btn small flat v-if="!loggedInUser">Register</v-btn>
                <v-menu v-else left offset-y nudge-bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                            <v-icon small>$vuetify.icons.user</v-icon>
                        </v-btn>
                    </template>
                    <v-list dense dark>
                        <v-list-tile v-for="(user, index) in allUsers" :key="index">
                            {{ user.userName }}
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <v-toolbar v-if="toolbar" dense>
                    <h3><slot name="toolbarTitle"></slot></h3>
                    <v-spacer />
                    <slot name="toolbarActions"></slot>
                </v-toolbar>
            <slot></slot>
        </v-content>
    </v-app>
</template>
<script>
import { mapState } from 'vuex';

export default {
    name: 'PageLayout',
    props: {
        toolbar: {
            type: Boolean
        }
    },
    data() {
        return {
            drawer: true,
            users: {}
        };
    },
    computed: {
        ...mapState('users', {
            loggedInUserId: state => state.loggedInUserId,
            allUsers: state => state.users
        })
    }
};
</script>
<style lang="scss" scoped>
</style>
