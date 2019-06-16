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
                <template v-slot:content="{ close }">
                    <person-form id="personForm"
                        v-if="user"
                        :user="user"
                        @form-submitted="saveUser(close)"
                        @form-valid="personFormValid"
                        @form-updated="personFormValue"/>
                </template>
                <template v-slot:actions="{ close }">
                    <v-btn type="submit" form="personForm"
                        color="warning"
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
import PageLayout from '@/layouts/PageLayout.vue';
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
            user: false,
            isPersonFormValid: false,
            personForm: {}
        };
    },
    computed: {
        ...mapState('users', {
            loggedInUser: state => state.loggedInUser,
            allUsers: state => state.users
        }),
        userId() {
            return this.$route.params.uid;
        }
    },
    methods: {
        saveUser(close) {
            Object.keys(this.personForm).forEach((key) => {
                this.user[key] = this.personForm[key];
            });
            this.$api.update('users.user', this.user)
                .then((updatedUser) => {
                    this.user = updatedUser;
                    close();
                })
                .catch((err) => {
                    alert(err);
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
        },
        loadUser() {
            this.$api.read('users.user', this.userId)
                .then((user) => {
                    this.user = user;
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },
    watch: {
        userId() {
            this.loadUser();
        }
    },
    beforeMount() {
        this.loadUser();
    }
};
</script>
