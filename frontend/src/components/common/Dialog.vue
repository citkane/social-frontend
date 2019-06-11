<template>
    <v-dialog :width="width" v-model="dialog">
        <template v-slot:activator="{ on }">
            <v-btn
                :icon="icon || false"
                :small="small || false"
                :flat="flat || false"
                :color="color"
                v-on="on">
                <slot name="button"></slot>
            </v-btn>
        </template>
        <v-card>
            <v-card-title primary-title class="headline secondary lighten-4">
                {{ title }}
            </v-card-title>
            <v-card-text>
                <slot name="content">this is the text</slot>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <slot name="actions" v-bind:close = "close"></slot>
                <v-btn color="success" @click="close">cancel</v-btn>
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
        icon: {
            type: Boolean
        },
        small: {
            type: Boolean
        },
        flat: {
            type: Boolean
        },
        color: {
            type: String
        }
    },
    methods: {
        close() {
            this.dialog = false;
        }
    },
    data() {
        return {
            dialog: false
        };
    }
};
</script>
