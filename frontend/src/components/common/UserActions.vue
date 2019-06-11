<template>
    <div id="user-actions" class="d-flex fill-height">
        <ee-dialog title="Login" flat v-if="!loggedInUser">
            <template v-slot:button>
                Login
            </template>
            <template v-slot:content>
                <v-form v-model="valid">
                    <v-text-field v-model="form.userName" label="Username" required
                        :rules="rules.userName"/>
                    <v-text-field required
                        type="password"
                        v-model="form.password"
                        label="Password"
                        :rules="rules.password"/>
                </v-form>
            </template>
            <template v-slot:actions="{ close }">
                <v-btn @click="login(close)" color="warning"
                    :disabled="!valid">LogIn</v-btn>
            </template>
        </ee-dialog>
        <v-btn flat v-if="!loggedInUser">Register</v-btn>
        <v-menu v-else left offset-y nudge-bottom>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" flat>
                    {{ loggedInUser.realName }}
                    <v-icon small right>$vuetify.icons.user</v-icon>
                </v-btn>
            </template>
            <v-list dense dark>
                <v-list-tile class="click" @click="$router.push(`/people/${loggedInUser.uid}`)">
                    My Account
                </v-list-tile>
                <v-list-tile class="click" @click="logout">
                    Log out
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
import EeDialog from '@/components/common/Dialog';
import eventBus from '@/plugins/eventBus';
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Login',
    components: {
        EeDialog
    },
    data() {
        return {
            valid: false,
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    v => !!v || 'Username is required'
                ],
                password: [
                    v => !!v || 'A password required'
                ]
            }
        };
    },
    computed: {
        ...mapState('users', {
            loggedInUser: state => state.loggedInUser
        })
    },
    methods: {
        login(close) {
            eventBus.$emit('logIn', this.form);
            eventBus.$on('user-logged-in', () => {
                close();
            });
            eventBus.$on('user-logged-in-error', (err) => {
                alert(err);
            });
        },
        logout() {
            eventBus.$emit('logOut');
            this.$router.push('/');
        }
    }
};
</script>
