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
                <template v-slot:content="{ close }">
                    <activity-form id="activityForm"
                        @form-valid="activityFormValid"
                        @form-updated="activityFormValue"
                        @form-submitted="saveActivity(close)"/>
                </template>
                <template v-slot:actions>
                    <v-btn type="submit" form="activityForm" color="warning"
                        :disabled="!isActivityFormValid">save</v-btn>
                </template>
            </ee-dialog>
        </template>
        <v-container flex id="activities" grid-list-md>
            <v-layout wrap>
                <v-flex v-for="(activity, index) in allActivities" :key="index" md3>
                    <v-card >
                        <v-card-title @click="goToActivity(activity.uid)" class="click">
                            {{ activity.title }}
                        </v-card-title>
                        <v-card-text class="spaced">{{ activity.about }}</v-card-text>
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
import ActivityForm from '@/components/forms/ActivityForm';
import { mapState } from 'vuex';

export default {
    name: 'People',
    components: {
        PageLayout,
        EeDialog,
        ActivityForm
    },
    data() {
        return {
            drawer: true,
            activities: {},
            isActivityFormValid: false,
            activityForm: {}
        };
    },
    computed: {
        ...mapState('activities', {
            allActivities: state => state.activities
        })
    },
    methods: {
        goToActivity(uid) {
            this.$router.push(`/activities/${uid}`);
        },
        activityFormValid(valid) {
            this.isActivityFormValid = valid;
        },
        activityFormValue(form) {
            this.activityForm = form;
        },
        saveActivity(close) {
            this.$api.create('activities.activity', this.activityForm)
                .then(() => {
                    this.activityForm = {};
                    close();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
};
</script>
