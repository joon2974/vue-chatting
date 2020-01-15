<template>
    <v-chip class="ma-2">
        <v-icon left>mdi-star</v-icon>
        {{chipName}}
    </v-chip>
</template>

<script>
export default{
    name: 'ChipComponent',
    props:{
        chipName: String
    }
}
</script>