<template lang="jade">
  .hello
    loader(v-show="!hands.length")
    .ui.divider
    .ui.two.doubling.cards.container
      .ui.card(v-for="(h, index) in searchBy(hands, mySearch)", :key="index" v-if="book && book.indexOf(h.id) > -1")
        card(:h="h", :full="false",:book="book", :mySearch="mySearch", @locate="locate", @addBook="addBook", @removeBook="removeBook")
</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Loader from './Loader'
import Card from './Card'

export default {
  name: 'hello',
  mixins: [mix],
  props: ['mySearch', 'book'],
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
    },
    addBook: function (id) {
      console.log(id)
      this.$emit('addBook', id)
    },
    removeBook: function (index) {
      console.log(index)
      this.$emit('removeBook', index)
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
