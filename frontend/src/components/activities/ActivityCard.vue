<template>
    <v-card>
        <v-toolbar color="teal lighten-3" flat dark>
            <div @click="goToActivity(activity.uid)" class="click title font-weight-regular">
                {{ activity.title }}
            </div>
        </v-toolbar>
        <v-slide-y-transition>
            <v-card-text v-show="show" class="spaced">{{ activity.about }}</v-card-text>
        </v-slide-y-transition>
        <div class="grow"></div>
        <v-divider />
        <v-card-actions>
            <Vote :entityId="activityId" class="ml-1" @voted="vote"/>
            <v-spacer></v-spacer>
            <v-btn icon @click="show = !show">
                <v-icon small>{{ show ? $vuetify.icons.arrow_up : $vuetify.icons.arrow_down }}</v-icon>
            </v-btn>
        </v-card-actions>

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
    data() {
        return {
            show: false
        };
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
        vote(votes) {
            this.$emit('voted', { votes, activityId: this.activityId });
        }
    }
};
</script>

<style lang="scss" scoped>
    .v-card {
        display: flex;
        flex-direction: column;
    }

</style>
