<template>
    <div>
        <v-icon @click="$emit('thumb', '+')" class="thumb up">fas fa-thumbs-up</v-icon>
        <v-icon @click="$emit('thumb', '-')" class="thumb down">fas fa-thumbs-down</v-icon>
    </div>
</template>

<style lang="scss" scoped>
    .thumb {
        position: relative;
        top: 4px;
        cursor: pointer;
        padding: 5px;
    }
    .thumb.up {
        transform: scale(-1, 1);
        top: -5px;
    }
    .thumb:hover {
        caret-color: #E0F2F1!important;
        color: #E0F2F1!important;
    }
</style>
