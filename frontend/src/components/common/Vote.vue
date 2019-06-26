<template>
    <div class="d-flex align-center">
        <v-icon small @click="vote('+')" class="thumb up" :class="classes['+']" :color="color['+']">
            fas fa-thumbs-up
        </v-icon>
        <span class="total title text-xs-center">{{ votes.total }}</span>
        <v-icon small @click="vote('-')" class="thumb down" :class="classes['-']" :color="color['-']">
            fas fa-thumbs-down
        </v-icon>
    </div>
</template>

<script>
export default {
    name: 'Vote',
    props: {
        entityId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            votes: {}
        };
    },
    computed: {
        classes() {
            const classes = { '+': 'active', '-': 'active' };
            if (this.votes.voted) classes[this.votes.voted] = '';
            return classes;
        },
        color() {
            const color = { '+': 'secondary', '-': 'secondary' };
            if (this.votes.voted) color[this.votes.voted] = 'blue-grey lighten-4';
            return color;
        }
    },
    methods: {
        vote(dir) {
            if (this.votes.voted && this.votes.voted === dir) return;
            this.$api.update('voting.vote', [this.entityId, dir])
                .catch((err) => {
                    console.error(err.message);
                });
        },
        getVotes() {
            this.$api.read('voting.votes', this.entityId)
                .then((votes) => {
                    this.votes = votes;
                    this.$emit('voted', this.votes.total);
                })
                .catch((err) => {
                    console.error(err.message);
                });
        }
    },
    mounted() {
        this.getVotes();
        this.$api.socket.on('voting/voted', (entityId) => {
            if (entityId === this.entityId) this.getVotes();
        });
    },
    beforeDestroy() {
        this.$api.socket.off('voting/voted');
        console.log('socketoff');
    }

};
</script>


<style lang="scss" scoped>
    .thumb {
        padding: 5px;
        cursor: default!important;
    }
    .thumb.up {
        transform: scale(-1, 1);
        margin-bottom:6px;
    }
    .thumb.down {
        margin-top:6px;
    }
    .thumb.active {
        cursor: pointer!important;
    };
    .total {
        min-width:30px;
    }
</style>
