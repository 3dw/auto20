<template lang="pug">
  .hello
    loader(v-show="!hands.length")
    .ui.segment.container
      .ui.fluid.card(v-for="(h, index) in hands" v-if="h.uid == $route.params.uid")
        card(:h="h", :full="true", :book="book", :mySearch="mySearch", @locate="locate", @addBook="addBook")

        ShareNetwork.ui.huge.blue.button(network="facebook", :url="'https://we.alearn.org.tw/#/flag/' + h.uid", :title="h.name", :description="h.name + ': ' + h.note", :quote="h.name + ': ' + h.note")
          i.facebook.icon
          | 臉書分享
</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Card from './Card'
import Loader from './Loader'

export default {
  name: 'flag',
  components: { Card, Loader },
  mixins: [mix],
  props: ['mySearch', 'book'],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '旗幟',
  },
  data () {
    return {
      hands: []
    }
  },
  firebase: {
    hands: handsRef
  },
  methods: {
    locate: function (h) {
      this.$emit('locate', h)
    },
    addBook: function (uid) {
      console.log(uid)
      this.$emit('addBook', uid)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #35495E;
}

.card {
  min-height: 80vh;
}

</style>
