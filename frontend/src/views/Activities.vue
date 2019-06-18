<template>
    <page-layout toolbar>
        {{ orderByVote}}
        <template v-slot:toolbarTitle>Activities</template>
        <template v-slot:toolbarActions>
            <ee-dialog title="Create an activity" icon elevation="7" :stepped="2" :width="700">
                <template v-slot:button>
                    <v-tooltip left>
                        <template v-slot:activator="{ on }">
                            <v-icon color="primary" v-on="on">$vuetify.icons.plus</v-icon>
                        </template>
                        <span>Suggest a new activity</span>
                    </v-tooltip>
                </template>
                <template v-slot:frameless-content="{ close, step }">
                    <activity-form id="activityForm"
                        :step="step"
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
                <v-flex v-for="(activity, index) in allActivities" :key="index"
                    md3
                    class="d-flex"
                    :style="{ order: orderByVote[activity.uid] }">
                    <activity-card :activityId="activity.uid" @voted="vote"/>
                </v-flex>
            </v-layout>
        </v-container>
    </page-layout>
</template>
<script>
import Vue from 'vue';
import PageLayout from '@/layouts/PageLayout';
import EeDialog from '@/components/common/Dialog';
import ActivityForm from '@/components/forms/ActivityForm';
import ActivityCard from '@/components/activities/ActivityCard';
import { mapState } from 'vuex';

export default {
    name: 'People',
    components: {
        PageLayout,
        EeDialog,
        ActivityForm,
        ActivityCard
    },
    data() {
        return {
            drawer: true,
            activities: {},
            isActivityFormValid: false,
            activityForm: {},
            orderByVote: {}
        };
    },
    computed: {
        ...mapState('activities', {
            allActivities: state => state.activities
        })
    },
    methods: {
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
        },
        vote(data) {
            Vue.set(this.orderByVote, data.activityId, data.votes);
            console.log(this.orderByVote);
        }
    }
};
</script>
