<template>
    <v-dialog :width="width" v-model="dialog">
        <template v-slot:activator="{ on }">
            <v-btn
                :icon="icon || false"
                :small="small || false"
                :large="large || false"
                :flat="flat || false"
                :color="color"
                :class="`elevation-${elevation}`"
                v-on="on">
                <slot name="button"></slot>
            </v-btn>
        </template>
        <v-card>
            <v-card-title primary-title class="headline secondary lighten-5 primary--text">
                {{ title }}
            </v-card-title>
            <slot name="frameless-content" v-bind:close = "close" v-bind:step="step"></slot>
            <v-card-text>
                <slot name="content" v-bind:close = "close"></slot>
            </v-card-text>
            <v-card-actions>
                <v-btn color="success" @click="close">cancel</v-btn>
                <slot name="actions" v-bind:close = "close" v-bind:step="step"></slot>
                <v-spacer />
                <v-btn @click="step -= 1" v-if="stepped && step > 1">previous</v-btn>
                <v-btn @click="step += 1" v-if="stepped && step < stepped">next</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'EeDialog',
    props: {
        width: {
            type: Number,
            default: 500
        },
        title: {
            type: String,
            required: true
        },
        icon: Boolean,
        small: Boolean,
        large: Boolean,
        flat: Boolean,
        color: String,
        elevation: {
            type: String,
            default: '0'
        },
        stepped: Number
    },
    data() {
        return {
            dialog: false,
            step: 1
        };
    },
    methods: {
        close() {
            this.dialog = false;
        }
    }
};
</script>
