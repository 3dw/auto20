<template lang="jade">
  .hello
    h1.ui.header
      img(src="../assets/handshake0.png")
      | {{msg}} {{user && user.providerData[0].displayName}}
      img(src="../assets/handshake0.png")
    h4.ui.header 升上互助旗，和
      span(v-if = "hands && hands.length") {{ hands.length }}
      span(v-else) 各
      | 位朋友相互認識
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
    a.ui.massive.red.button(v-if="isFacebookApp()", href="https://www.playpcesor.com/2014/11/facebook-app-15.html", target="_blank")
      | 按右上的...用瀏覽器開啟
    .ui.divider
    h2(v-if="hands.length") 最近更新 
    .ui.two.doubling.cards.container
      .ui.card(v-for="(h, index) in searchBy(hands, mySearch).slice(0, 4)", :key="index")
        card(:h="h", :full="false", :mySearch="mySearch", :id="id", :book="book", @locate="locate", @addBook="addBook", @removeBook="removeBook")

</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Card from './Card'

export default {
  name: 'hello',
  components: { Card },
  props: ['id', 'user', 'mySearch', 'photoURL', 'book'],
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
    },
    isFacebookApp: function () {
      var ua = navigator.userAgent || navigator.vendor || window.opera
      return (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1)
    },
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

.ui.avatar {
  max-height: 100px;
  max-width: 100px;
  border-radius: 50%;
}

</style>
