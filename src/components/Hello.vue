<template lang="jade">
  .hello
    h1 {{msg}} {{user.displayName}}
    a.ui.massive.blue.button(@click="login", v-if="!user")
      i.facebook.icon
      | 登入
    router-link.ui.massive.blue.button(to="/myFlag", v-else)
      img(:src = "'http://graph.facebook.com/' + id + '/picture'")
      | 我的旗幟
    .ui.divider
    h2(v-if="hands.length") 最近更新 
    .ui.two.doubling.cards.container
      router-link.ui.card(v-for="(h, index) in searchBy(hands, mySearch).slice(0, 4)", :key="index", :to="'/flag/'+h.id")
        card(:h="h", :full="false")

</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Card from './Card'

export default {
  name: 'hello',
  components: { Card },
  props: ['id', 'user', 'mySearch'],
  mixins: [mix],
  data () {
    return {
      msg: '歡迎'
    }
  },
  firebase: {
    hands: handsRef
  },
  methods: {
    login: function () {
      this.$emit('login')
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
