<template>
    <v-form v-model="valid">
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
                uid: this.user.uid,
                userName: this.user.userName,
                realName: this.user.realName,
                about: this.user.about
            },
            rules: {
                uid: [
                    v => !!v
                ],
                userName: [
                    v => !!v || 'Username is required'
                ],
                realName: [
                    v => !!v || 'A real name is required'
                ]
            }
        };
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
            handler(user) {
                Object.keys(user).forEach((key) => {
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
