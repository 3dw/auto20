<template lang="pug">
  .hello
    h1
      router-link(to="/cards", v-if="book && !book.length") 您的名簿目前沒有人，按此找朋友
    loader(v-show="!hands.length")
    .ui.divider
    .ui.two.doubling.cards.container
      .ui.card(v-for="(h, index) in searchBy(places, mySearch)", :key="index" v-if="book && book.indexOf(h.idx) > -1")
        card(:h="h", :full="false",:book="book", :mySearch="mySearch", @locate="locate", @addBook="addBook", @removeBook="removeBook")
      .ui.card(v-for="(h, index) in searchBy(hands, mySearch)", :key="index" v-if="book && book.indexOf(h.uid) > -1")
        card(:h="h", :full="false",:book="book", :mySearch="mySearch", @locate="locate", @addBook="addBook", @removeBook="removeBook")
</template>

<script>

import { handsRef, placesRef } from '../firebase'
import mix from '../mixins/mix.js'
import Loader from './Loader'
import Card from './Card'

export default {
  name: 'book',
  mixins: [mix],
  props: ['mySearch', 'book'],
  components: { Loader, Card },
  data () {
    return {
      hands: [],
      places: []
    }
  },
  firebase: {
    hands: handsRef,
    places: placesRef
  },
  methods: {
    locate: function (h) {
      this.$emit('locate', h)
    },
    addBook: function (uid) {
      console.log(uid)
      this.$emit('addBook', uid)
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
