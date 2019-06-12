<template>
    <page-layout toolbar>
        <template v-slot:toolbarTitle>Activities</template>
        <template v-slot:toolbarActions>
            <ee-dialog title="Create an activity" icon elevation="7">
                <template v-slot:button>
                    <v-tooltip left>
                        <template v-slot:activator="{ on }">
                            <v-icon color="primary" v-on="on">$vuetify.icons.plus</v-icon>
                        </template>
                        <span>Suggest a new activity</span>
                    </v-tooltip>
                </template>
                <template v-slot:content>
                </template>
                <template v-slot:actions="{ close }">
                </template>
            </ee-dialog>
        </template>
        <v-container flex id="activities" grid-list-md>
            <v-layout wrap>
                <!-- v-flex v-for="(user, index) in allUsers" :key="index" md3>
                    <v-card >
                        <v-card-title @click="goToPerson(user.uid)" class="click">
                            {{ user.realName }}
                        </v-card-title>
                        <v-card-text class="spaced">{{ user.about }}</v-card-text>
                        <v-card-actions></v-card-actions>
                    </v-card>
                </v-flex -->
            </v-layout>
        </v-container>
    </page-layout>
</template>
<script>
import PageLayout from '@/layouts/PageLayout.vue';
import EeDialog from '@/components/common/Dialog';
import { mapState } from 'vuex';

export default {
    name: 'People',
    components: {
        PageLayout,
        EeDialog
    },
    data() {
        return {
            drawer: true,
            users: {},
            isPersonFormValid: false,
            personForm: {}
        };
    },
    computed: {
        ...mapState('users', {
            allUsers: state => state.users
        })
    },
    methods: {
        goToPerson(uid) {
            this.$router.push(`/people/${uid}`);
        },
        personFormValid(valid) {
            this.isPersonFormValid = valid;
        },
        personFormValue(form) {
            this.personForm = form;
        },
        saveUser(close) {
            this.$api.create('users.user', this.personForm)
                .then(() => {
                    this.personForm = {};
                    close();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
};
</script>
