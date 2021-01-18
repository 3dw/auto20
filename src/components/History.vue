<template lang="pug">
  .hello
    loader(v-show="!hands.length")
    .ui.divider
    
    Timeline(:timeline-items="timelineItems", :message-when-no-items="messageWhenNoItems")
</template>

<script>

import { handsRef, placesRef } from '../firebase'
import mix from '../mixins/mix.js'
import Loader from './Loader'
import Card from './Card'
import Timeline from 'timeline-vuejs'

export default {
  name: 'cards',
  mixins: [mix],
  props: ['mySearch', 'id', 'book'],
  components: { Loader, Card, Timeline },
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '歷史',
  },
  data () {
    return {
      n: 20,
      busy: false,
      hands: [],
      places: [],
      messageWhenNoItems: '歡迎您好'
    }
  },
  computed: {
    list: function () {
      var l = this.hands.concat(this.places).slice().sort(function(a,b) {
        if (!b.lastUpdate || isNaN(b.lastUpdate)) { return -1}
        return b.lastUpdate - a.lastUpdate
      })
      return l
    },
    timelineItems: function () {
      return this.list.map((h) => {
        var obj = {}
        var src = this.getIcon(h)
        var href = '#/flag/' + h.uid
        obj.from = new Date(h.lastUpdate)
        obj.title = h.name + '登入'
        obj.description = '<a href ="' + href + '"><img class = "history" src="'+ src + '"/> ' + (''+h.note).substr(0,100) + '...</a>'
        return obj
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

.timeline {
  max-width: 720px !important;
  margin: 0 auto;
}

@media screen and (max-width: 420px) {
  .timeline {
    position: relative;
    left: -2em;
  }
}

</style>
