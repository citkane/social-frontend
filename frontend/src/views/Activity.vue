/* eslint-disable no-alert */
<template>
    <page-layout toolbar>
        <template v-slot:toolbarTitle>
            <span class="click" @click="$router.push('/activities')">Activities | </span>
            <span v-if="activity">{{ activity.title }}</span>
        </template>
        <template v-slot:toolbarActions v-if="activity">
            <Vote :entityId="activityId" class="mx-2" />
            <ee-dialog title="Edit Activity" icon elevation="7" v-if="editable"
                :stepped="2" :width="700">
                <template v-slot:button>
                    <v-icon small color="primary">$vuetify.icons.edit</v-icon>
                </template>
                <template v-slot:frameless-content="{ close, step }">
                    <activity-form id="activityForm"
                        v-if="activity"
                        :activity="activity"
                        :step="step"
                        @form-submitted="saveActivity(close)"
                        @form-valid="activityFormValid"
                        @form-updated="activityFormValue"/>
                </template>
                <template v-slot:actions="{ close }">
                    <v-btn type="submit" form="activityForm"
                        color="warning"
                        :disabled="!activityFormValid">save</v-btn>
                    <v-btn @click="deleteActivity(close)" dark color="red">delete</v-btn>
                </template>
            </ee-dialog>
        </template>
        <v-container fluid id="activity" v-if="activity">
            {{ editable }}
            <h2>{{ activity.title }}</h2>
            <div>{{ activity.date }}</div>
            <div class="spaced">{{ activity.about }}</div>

        </v-container>
    </page-layout>
</template>
<script>
import PageLayout from '@/layouts/PageLayout';
import EeDialog from '@/components/common/Dialog';
import ActivityForm from '@/components/forms/ActivityForm';
import Vote from '@/components/common/Vote';
import { mapState } from 'vuex';

export default {
    name: 'User',
    components: {
        PageLayout,
        EeDialog,
        ActivityForm,
        Vote
    },
    data() {
        return {
            activityId: this.$route.params.uid,
            activity: false,
            isActivityFormValid: false,
            activityForm: {}
        };
    },
    computed: {
        ...mapState('users', {
            loggedInUser: state => state.loggedInUser
        }),
        editable() {
            return this.loggedInUser.uid === this.activity.ownerId;
        }
    },
    methods: {
        saveActivity(close) {
            Object.keys(this.activityForm).forEach((key) => {
                this.activity[key] = this.activityForm[key];
            });
            this.$api.update('activities.activity', this.activity)
                .then((updatedActivity) => {
                    this.activity = updatedActivity;
                    close();
                })
                .catch((err) => {
                    alert(err);
                });
        },
        deleteActivity(close) {
            this.$api.delete('activities.activity', this.activity)
                .then(() => {
                    close();
                    this.$router.push('/activities');
                })
                .catch((err) => {
                    alert(err);
                });
        },
        activityFormValid(valid) {
            this.isActivityFormValid = valid;
        },
        activityFormValue(form) {
            this.activityForm = form;
        }
    },
    beforeMount() {
        this.$api.read('activities.activity', this.activityId)
            .then((activity) => {
                this.activity = activity;
            })
            .catch((err) => {
                console.log(err);
            });
    }
};
</script>
