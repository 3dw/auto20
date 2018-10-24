<template lang="jade">
  .hello
    .ui.four.doubling.cards
      router-link.card(v-for="(h, index) in hands", :to="'/flag/'+index")
        h4.ui.header
          img.main(src='../assets/handshake0.png', :src='getIcon(h)' alt='^_^')
          | {{h.name}}
          span(v-if="h.learner_birth") -
            | 約
            span(v-html='toAge(h.learner_birth)')
            | 歲

</template>

<script>

import { handsRef } from '../firebase'

export default {
  name: 'hello',
  data () {
    return {
    }
  },
  firebase: {
    hands: handsRef
  },
  methods: {
    toAge: function (y) {
      var ans = (new Date()).getFullYear()
      return ans - parseInt(y)
    },
    getIcon: function (h) {
      if (!h) {
        return ''
      }
      return 'http://graph.facebook.com/' + (h.fbid || h.id || h.username || h.username) + '/picture'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
</style>
