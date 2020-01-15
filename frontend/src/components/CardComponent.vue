<template>
    <v-col :cols="cardInfo.flex">
        <v-card>
            <v-img :src="cardInfo.src" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px">
                <v-card-title v-text="cardInfo.title"></v-card-title>
            </v-img>
            <v-card-actions>
                <v-spacer></v-spacer>
                
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
  
                <v-btn icon>
                  <v-icon>mdi-bookmark</v-icon>
                </v-btn>
  
                <v-btn icon>
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
</template>

<script>
export default{
    props: ['cardInfo']
}
</script>