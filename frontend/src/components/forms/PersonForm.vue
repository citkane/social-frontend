<template>
    <v-form v-model="valid"
        @submit.prevent="$emit('form-submitted'); resetForm();"
        ref="personForm">
        <v-text-field v-model="form.userName" label="Username" required :rules="rules.userName"/>
        <v-text-field required
            v-model="form.realName"
            label="Display Name"
            :rules="rules.realName"/>
        <v-textarea v-model="form.about" label="About" />
    </v-form>
</template>
<script>
export default {
    name: 'PersonForm',
    props: {
        user: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            valid: false,
            form: {
                userName: this.user.userName,
                realName: this.user.realName,
                about: this.user.about
            },
            rules: {
                userName: [
                    v => !!v || 'Username is required'
                ],
                realName: [
                    v => !!v || 'A real name is required'
                ]
            }
        };
    },
    computed: {
        mode() {
            return Object.keys(this.user).length ? 'edit' : 'create';
        }
    },
    methods: {
        resetForm() {
            Object.keys(this.form).forEach((key) => {
                this.form[key] = null;
            });
            if (this.mode === 'create') this.$refs.personForm.reset();
        }
    },
    watch: {
        valid() {
            this.$emit('form-valid', this.valid);
        },
        form: {
            handler(val) {
                this.$emit('form-updated', val);
            },
            deep: true
        },
        user: {
            handler() {
                Object.keys(this.form).forEach((key) => {
                    this.form[key] = this.user[key];
                });
            },
            deep: true
        }
    },
    ready() {
        this.$emit('form-updated', this.form);
        this.$emit('form-valid', this.valid);
    }
};
</script>
