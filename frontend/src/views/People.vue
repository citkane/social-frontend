<template>
    <page-layout toolbar>
        <template v-slot:toolbarTitle>People</template>
        <template v-slot:toolbarActions>
            <ee-dialog title="Create Person" flat icon elevation="7">
                <template v-slot:button>
                    <v-icon small color="primary">fas fa-user-plus</v-icon>
                </template>
                <template v-slot:content="{ close }">
                    <person-form id="personForm"
                        @form-valid="personFormValid"
                        @form-updated="personFormValue"
                        @form-submitted="saveUser(close)"/>
                </template>
                <template v-slot:actions>
                    <v-btn type="submit" form="personForm" color="warning"
                        :disabled="!isPersonFormValid">save</v-btn>
                </template>
            </ee-dialog>
        </template>
        <v-container flex id="people" grid-list-md>
            <v-layout wrap>
                <v-flex v-for="(user, index) in allUsers" :key="index"
                md3
                class="d-flex column">
                    <v-card>
                        <v-toolbar color="teal lighten-3" flat @click="goToPerson(user.uid)" class="click">
                            <v-toolbar-title>
                                {{ user.realName }}
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text class="spaced">{{ user.about }}</v-card-text>
                        <v-card-actions></v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </page-layout>
</template>
<script>
import PageLayout from '@/layouts/PageLayout';
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
