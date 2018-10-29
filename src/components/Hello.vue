<template lang="jade">
  .hello
    h1 {{msg}} {{user.displayName}}
    .ui.huge.buttons(v-if="!user")
      button.ui.blue.button(@click="loginFB")
        i.facebook.icon
        | 登入 
      .or
      button.ui.orange.button(@click="loginGoogle")
        i.google.icon
        | 登入

      
    router-link.ui.massive.blue.button(to="/myFlag", v-else)
      img.ui.avatar(:src = "photoURL || 'http://graph.facebook.com/' + id + '/picture'")
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
  props: ['id', 'user', 'mySearch', 'photoURL'],
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
    loginFB: function () {
      this.$emit('loginFB')
    },
    loginGoogle: function () {
      this.$emit('loginGoogle')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="">

.ui.avatar {
  max-height: 100px;
  max-width: 100px;
  border-radius: 50%;
}

</style>
