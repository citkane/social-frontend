/* eslint-disable no-param-reassign */
export default {
    namespaced: true,
    state: {
        activities: []
    },
    mutations: {
        activities(state, activities) {
            state.activities = activities;
        }
    },
    actions: {
        getAllActivities(context) {
            this.$api.read('activities.activities')
                .then((activities) => {
                    context.commit('activities', activities);
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        addActivity(context, activity) {
            const { activities } = context.state;
            activities[activity.uid] = activity;
            context.commit('activities', { ...activities });
        },
        updateActivity(context, activity) {
            const { activities } = context.state;
            activities[activity.uid] = activity;
            context.commit('activities', { ...activities });
        },
        deleteActivity(context, activity) {
            const { activities } = context.state;
            delete activities[activity.uid];
            context.commit('activities', { ...activities });
        },
        populate() {
            const { socket } = this.$api;
            socket.on('activities/activity-created', (activity) => {
                this.dispatch('activities/addActivity', activity);
            });
            socket.on('activities/activity-updated', (activity) => {
                this.dispatch('activities/updateActivity', activity);
            });
            socket.on('activities/activity-deleted', (activity) => {
                this.dispatch('activities/deleteActivity', activity);
            });
            this.dispatch('activities/getAllActivities');
        },
        cleanUp(context) {
            const { socket } = this.$api;
            socket.off('activities/activity-created');
            socket.off('activities/activity-updated');
            socket.off('activities/activity-deleted');
            context.commit('activities', {});
        }
    }
};
