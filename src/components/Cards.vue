<template lang="pug">
  .hello
    loader(v-show="!hands.length")
    .ui.divider
    .ui.two.doubling.cards.container(v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10")
      .ui.card(v-for="(h, index) in searchBy(list, mySearch).slice(0,n)", :key="index")
        card(:h="h", :full="false", :mySearch="mySearch", :id="id", :book="book", @locate="locate", @addBook="addBook", @removeBook="removeBook")
</template>

<script>

import { handsRef, placesRef } from '../firebase'
import mix from '../mixins/mix.js'
import Loader from './Loader'
import Card from './Card'

export default {
  name: 'cards',
  mixins: [mix],
  props: ['mySearch', 'id', 'book'],
  components: { Loader, Card },
  data () {
    return {
      n: 20,
      busy: false,
      hands: [],
      places: []
    }
  },
  computed: {
    list: function () {
      return this.hands.concat(this.places).sort(function(a,b) {
        return b.lastUpdate - a.lastUpdate
      })
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
    addBook: function (id) {
      console.log(id)
      this.$emit('addBook', id)
    },
    removeBook: function (index) {
      console.log(index)
      this.$emit('removeBook', index)
    },
    loadMore: function () {
      this.busy = true

      setTimeout(() => {
        this.n += 20
        this.busy = false
      }, 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
