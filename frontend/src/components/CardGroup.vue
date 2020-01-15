<template>
    <v-container fluid>
        <v-row dense>
            <card-component v-for="card in cardList" :key="card.title" :cardInfo="card"></card-component>
        </v-row>
    </v-container>
</template>

<script>
    import CardComponent from './CardComponent'

    export default{
        components: {
            'card-component': CardComponent
        },
        props: ['cardList']
    }
</script>