<template>
    <v-row justify="space-around">
        <v-col cols="12" sm="11" md="11" lg="11">
            <v-sheet elevation="10" class="pa-4">
                <v-chip-group column active-class="primary--text">
                    <chip-component v-for="(name, index) in chipList" :key="index" :chipName="name"></chip-component>
                </v-chip-group>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script>
import ChipComponent from './ChipComponent'

export default{
    components: {
        'chip-component': ChipComponent
    },
    props: ['chipList']
}
</script>