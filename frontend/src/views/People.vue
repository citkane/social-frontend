<template>
    <page-layout toolbar>
        <template v-slot:toolbarTitle>People</template>
        <template v-slot:toolbarActions>
            <ee-dialog title="Create Person">
                <template v-slot:button>
                    New Person
                </template>
                <template v-slot:content>
                    <person-form
                        @form-valid="personFormValid"
                        @form-updated="personFormValue"/>
                </template>
                <template v-slot:actions="{ close }">
                    <v-btn @click="saveUser(close)" color="warning"
                        :disabled="!isPersonFormValid">save</v-btn>
                </template>
            </ee-dialog>
        </template>
        <v-container flex id="people" grid-list-md>
            <v-layout wrap>
                <v-flex v-for="(user, index) in allUsers" :key="index" md3>
                    <v-card >
                        <v-card-title @click="goToPerson(user.uid)">
                            {{ user.userName }}
                        </v-card-title>
                        <v-card-text>About the user</v-card-text>
                        <v-card-actions></v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </page-layout>
</template>
<script>
import PageLayout from '@/layouts/PageLayout.vue';
import EeDialog from '@/components/common/Dialog';
import PersonForm from '@/components/forms/PersonForm';
import { mapState } from 'vuex';

export default {
    name: 'People',
    components: {
        PageLayout,
        EeDialog,
        PersonForm
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
