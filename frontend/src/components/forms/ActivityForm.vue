<template>
    <v-form v-model="valid"
        @submit.prevent="$emit('form-submitted'); resetForm()"
        ref="activityForm">
        <v-text-field v-model="form.title" label="Activity title" required :rules="rules.title"/>
        <v-textarea v-model="form.about" label="About the activity" required :rules="rules.about" />
    </v-form>
</template>
<script>
export default {
    name: 'PersonForm',
    props: {
        activity: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            valid: false,
            form: {
                title: this.activity.title,
                about: this.activity.about
            },
            rules: {
                title: [
                    v => !!v || 'Activity title is required'
                ],
                about: [
                    v => !!v || 'Something about the activity is required'
                ]
            }
        };
    },
    computed: {
        mode() {
            return Object.keys(this.activity).length ? 'edit' : 'create';
        }
    },
    methods: {
        resetForm() {
            Object.keys(this.form).forEach((key) => {
                this.form[key] = null;
            });
            if (this.mode === 'create') this.$refs.activityForm.reset();
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
        activity: {
            handler() {
                Object.keys(this.form).forEach((key) => {
                    this.form[key] = this.activity[key];
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
