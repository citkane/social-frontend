<template>
    <v-form v-model="valid"
        @submit.prevent="$emit('form-submitted'); resetForm()"
        ref="activityForm">
        <v-stepper v-model="formSteps" class="pa-0">
            <v-stepper-header>
                <v-stepper-step :complete="formSteps > 1" step="1">Step 1</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2">About the activity</v-stepper-step>
            </v-stepper-header>
            <v-card-text>
                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-text-field v-model="form.title"
                            label="Activity title"
                            required :rules="rules.title"/>
                        <v-text-field v-model="form.date"
                            type="date"
                            label="Propose a date"
                            required :rules="rules.date"
                            disabled />
                        <v-date-picker v-model="form.date"
                            required :rules="rules.date"
                            class="mt-3"
                            landscape />
                    </v-stepper-content>
                    <v-stepper-content step="2">
                        <v-textarea v-model="form.about"
                            label="About the activity"
                            required :rules="rules.about" />
                    </v-stepper-content>
                </v-stepper-items>
            </v-card-text>
        </v-stepper>
    </v-form>
</template>
<script>

export default {
    name: 'ActivityForm',
    props: {
        activity: {
            type: Object,
            default: () => ({})
        },
        step: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            valid: false,
            form: {
                title: this.activity.title,
                about: this.activity.about,
                date: this.activity.date
            },
            formSteps: 0,
            rules: {
                title: [
                    v => !!v || 'Activity title is required'
                ],
                about: [
                    v => !!v || 'Something about the activity is required'
                ],
                date: [
                    v => !!v || 'Please select a date'
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
            handler() {
                this.$emit('form-updated', this.form);
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
        },
        step() {
            this.formSteps = this.step;
        }
    },
    ready() {
        Object.keys(this.form).forEach((key) => {
            this.form[key] = this.activity[key];
        });
        this.$emit('form-updated', this.form);
        this.$emit('form-valid', this.valid);
    }
};
</script>
