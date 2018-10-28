<template lang="jade">
  .hello
    loader(v-show="!hands.length")
    .ui.divider
    .ui.two.doubling.cards.container
      .ui.card(v-for="(h, index) in searchBy(hands, mySearch)", :key="index")
        card(:h="h", :full="false", :mySearch="mySearch", @locate="locate")
</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Loader from './Loader'
import Card from './Card'

export default {
  name: 'hello',
  mixins: [mix],
  props: ['mySearch'],
  components: { Loader, Card },
  data () {
    return {
    }
  },
  firebase: {
    hands: handsRef
  },
  methods: {
    locate: function (h) {
      this.$emit('locate', h)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #35495E;
}

</style>
