<template>
    <page-layout toolbar>
        <template v-slot:toolbarTitle>
            <span class="click" @click="$router.push('/people')">People | </span>
            <span v-if="user">{{ user.userName }}</span>
        </template>
        <template v-slot:toolbarActions v-if="user">
            <ee-dialog title="Edit Person" icon elevation="7">
                <template v-slot:button>
                    <v-icon small color="primary">$vuetify.icons.edit</v-icon>
                </template>
                <template v-slot:content>
                    <person-form :user="user"
                        @form-valid="personFormValid"
                        @form-updated="personFormValue"/>
                </template>
                <template v-slot:actions="{ close }">
                    <v-btn @click="saveUser(close)" color="warning"
                        :disabled="!isPersonFormValid">save</v-btn>
                    <v-btn @click="deleteUser(close)" dark color="red">delete</v-btn>
                </template>
            </ee-dialog>
        </template>
        <v-container fluid id="person" v-if="user">
            <h2>{{ user.realName }}</h2>
            <div class="spaced">{{ user.about }}</div>

        </v-container>
    </page-layout>
</template>
<script>
import PageLayout from '@/layouts/PageLayout';
import EeDialog from '@/components/common/Dialog';
import PersonForm from '@/components/forms/PersonForm';
import { mapState } from 'vuex';

export default {
    name: 'User',
    components: {
        PageLayout,
        EeDialog,
        PersonForm
    },
    data() {
        return {
            userId: this.$route.params.uid,
            user: false,
            isPersonFormValid: false,
            personForm: {}
        };
    },
    computed: {
        ...mapState('users', {
            loggedInUserId: state => state.loggedInUserId,
            allUsers: state => state.users
        })
    },
    methods: {
        saveUser(close) {
            this.$api.update('users.user', this.personForm)
                .then((updatedUser) => {
                    this.user = updatedUser;
                    close();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        deleteUser(close) {
            this.$api.delete('users.user', this.user)
                .then(() => {
                    close();
                    this.$router.push('/people');
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        personFormValid(valid) {
            this.isPersonFormValid = valid;
        },
        personFormValue(form) {
            this.personForm = form;
        }
    },
    beforeMount() {
        this.$api.read('users.user', this.userId)
            .then((user) => {
                this.user = user;
            })
            .catch((err) => {
                console.log(err);
            });
    }
};
</script>
