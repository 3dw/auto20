<template lang="pug">
  .hello
    h1.ui.header
      img(src="../assets/handshake0.png")
      | {{msg}}
      img(src="../assets/handshake0.png")

    h4.ui.header 升上互助旗，和
      span(v-if = "users") {{ toList(users).length }}
      span(v-else) 各
      | 位朋友相互認識

    .ui.huge.buttons(v-if="!user")
      //button.ui.blue.button(@click="loginFB")
        i.facebook.icon
        | 登入 
      //.or
      button.ui.orange.button(@click="loginGoogle")
        i.google.icon
        | 登入 

    .ui.segment.container
      h2.ui.header 自學2.0是什麼?
      h4 自學2.0是一個公益的尋友平台，可以依地圖的地理位置尋友，也可依照孩子的年紀，升旗者的興趣和可分享的專長來尋友
      h2.ui.header 這是什麼單位在設計維護的?
      h4 本平台由
        a(href="http://www.alearn.org.tw", target="_blank") 自主學習促進會
        | 設計維護
      h2.ui.header 互助旗是什麼?
      h4 互助旗是一個帶有概略地理位置的自我介紹，讓人在和您碰面之前，先對您有初步的瞭解和認識
      h2.ui.header 我的互助旗會是公開的嗎?能不能保密?
      h4 互助旗是完全公開的，您可以只留下願意公開的資訊
      h2.ui.header 升起互助旗後可以修改嗎?
      h4 可以，只要再次登入，點選[我的旗幟]即可修改
      h2.ui.header 升起互助旗後可以移除嗎?
      h4 可以，您可以
        a(href="mailto:bestian@gmail.com") e-mail給管理員bestian@gmail.com
        | 手動移除
      h2.ui.header 地圖介面的用意?
      h4 讓您可以就近尋找夥伴，例如:[宜蘭附近有沒有自學朋友呢]? 看地圖就很清楚了

</template>

<script>

import mix from '../mixins/mix.js'
import Card from './Card'

export default {
  name: 'intro',
  components: { Card },
  props: ['uid', 'user', 'mySearch', 'photoURL', 'book', 'users'],
  mixins: [mix],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '使用說明',
  },
  data () {
    return {
      msg: '自學2.0使用說明'
    }
  },
  methods: {
    toList (obj) {
      const ks = Object.keys(obj)
      return ks.map(function (k) {
        return obj[k]
      })
    },
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

.ui.avatar {
  max-height: 100px;
  max-width: 100px;
  border-radius: 50%;
}

</style>
