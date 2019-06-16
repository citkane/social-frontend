<template>
    <v-card >
        <v-toolbar color="teal" dark class="lighten-2">
            <v-spacer />
            <Vote @thumb="vote"/>
        </v-toolbar>
        <v-card-title @click="goToActivity(activity.uid)" class="click headline">
            {{ activity.title }}
        </v-card-title>
        <v-card-text class="spaced">{{ activity.about }}</v-card-text>
        <v-card-actions></v-card-actions>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Vote from '@/components/common/Vote';

export default {
    name: 'ActivityCard',
    components: {
        Vote
    },
    props: {
        activityId: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapState('activities', {
            allActivities: state => state.activities
        }),
        activity() {
            return this.allActivities[this.activityId];
        }
    },
    methods: {
        goToActivity(uid) {
            this.$router.push(`/activities/${uid}`);
        },
        vote(foo) {
            alert(foo);
        }
    }
};
</script>
