<template lang="jade">
  .hello
    loader(v-show="!hands.length")
    .ui.form.container
      input(v-model="mySearch", placeholder="以關鍵字或年齡搜詢", autofocus)
    .ui.divider
    .ui.two.doubling.cards.container
      router-link.ui.card(v-for="(h, index) in searchBy(hands, mySearch)", :key="index", :to="'/flag/'+h.id")
        card(:h="h", :full="false")
</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Loader from './Loader'
import Card from './Card'

export default {
  name: 'hello',
  mixins: [mix],
  components: { Loader, Card },
  data () {
    return {
      mySearch: ''
    }
  },
  firebase: {
    hands: handsRef
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #35495E;
}

</style>
