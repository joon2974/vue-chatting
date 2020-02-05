<template>
    <div class="Message">
        <!-- User가 card라고 입력했을 때 -->
        <div v-if="message === 'card'">
            <card-component :cardList="cards"></card-component>
        </div>
        <!-- User가 chip이라고 입력했을 때 -->
        <div v-else-if="message === 'chip'">
            <chip-component :chipList="chips"></chip-component>
        </div>
        <!-- 그 외 일반적인 message입력 시 -->
        <div v-else>
            <!-- 관리자 message일 때 -->
            <div v-if="admin === true">
                <span>
                    <v-icon>mdi-bulletin-board</v-icon>
                </span>
                <span>{{message}}</span>
            </div>
            <!-- 일반 User의 message일 때, 자신의 입력은 아바타가 오른쪽, 타인은 왼쪽에 위치 -->
            <v-list-item v-else>
                 <v-list-item-action v-show="chatbot === true">
                    <v-avatar color="#0277BD" size="30">
                        <v-icon class="white--text">mdi-google-assistant</v-icon>
                    </v-avatar>
                </v-list-item-action>
                <v-list-item-action v-show="owner === false && chatbot == false">
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
        chatbot: Boolean
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