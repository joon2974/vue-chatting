<template>
    <div class="Message">
        <div v-if="message === 'card'">
            <card-component :cardList="cards"></card-component>
        </div>
        <div v-else-if="message === 'chip'">
            <chip-component :chipList="chips"></chip-component>
        </div>
        <div v-else>
            <div v-if="admin === true">
                <span>
                    <v-icon>mdi-bulletin-board</v-icon>
                </span>
                <span>{{message}}</span>
            </div>
            <v-list-item v-else>
                <v-list-item-action v-show="owner === false">
                    <v-avatar color="indigo" size="30">
                        <span class="white--text">{{name}}</span>
                    </v-avatar>
                </v-list-item-action>
                <v-list-item-content>
                    <v-textarea rows='1' row-height='10' auto-grow outlined disabled :value="message" :class="{owner}"></v-textarea>
                </v-list-item-content>
                <v-list-item-action v-show="owner === true">
                    <v-avatar color="orange" size="30">
                        <span class="white--text">{{name}}</span>
                    </v-avatar>
                </v-list-item-action>
            </v-list-item>
        </div>
    </div>
</template>

<script>
import CardGroup from './CardGroup.vue'
import ChipGroup from './ChipGroup.vue'
import {mapState} from 'vuex'

export default{
    props: {
        name: String,
        message: String,
        admin: Boolean,
        owner: Boolean,
    },
    components:{
        'card-component': CardGroup,
        'chip-component': ChipGroup
    },
    computed: {
        ...mapState(['cards', 'chips'])
    },
}
</script>

<style>
.owner {
    background: #fff;
    color: #000;
  }
  .Message{
      text-align: center;
  }
</style>