<template lang="jade">
  #app
    nav#menu.ui.fixed.top.inverted.menu.thin-only
      router-link.item(to="/", exact='') 
        i.home.icon
      router-link.item(to="/cards", exact='') 
        | 朋友
      router-link.item(to="/maps", exact='') 
        | 地圖
      router-link.item(to="/groups", exact='') 
        | 社團
      .right.menu
        a.item(@click="login", v-if="!user")
          | 登入
        router-link.item(to="/myFlag", v-else)
          img#me.icon(:src = "'http://graph.facebook.com/' + id + '/picture'")
          | 我
    nav#menu.ui.fixed.top.labeled.icon.inverted.menu.fat-only
      router-link.item(to="/", exact='') 
        i.home.icon
        | 自學2.0
      router-link.item(to="/cards", exact='') 
        i.comments.icon
        | 自學朋友
      router-link.item(to="/maps", exact='') 
        i.map.icon
        | 地圖
      router-link.item(to="/groups", exact='') 
        i.users.icon
        | 自學社團
      a.item(href="http://map.alearn.org.tw", target="_blank")
        i.phone.icon
        | 自學FAQ
      .right.menu
        a.item(@click="login", v-if="!user")
          i.facebook.icon
          | 登入
        router-link.item(to="/myFlag", v-else)
          img#me.icon(:src = "'http://graph.facebook.com/' + id + '/picture'")
          | 我的旗幟
    chatbox(v-if="id", :id="id", :user="user")
    main
      .ui.form.container(v-if="doSearch($route.path)")
        input(v-model="mySearch", placeholder="以關鍵字或年齡搜詢", autofocus)
      router-view(:id = "id", :user="user", :mySearch="mySearch", @login="login")
</template>

<script>

import firebase from 'firebase/app'
import mix from './mixins/mix.js'
import Chatbox from './components/Chatbox'

export default {
  name: 'app',
  mixins: [mix],
  components: { Chatbox },
  props: {
    mySearch: { type: String, default: '' }
  },
  data () {
    return {
      user: '',
      token: '',
      id: ''
    }
  },
  methods: {
    doSearch: function (p) {
      return (!(p.match(/^\/(myFlag|groups|flag\/\d+)?$/)))
    },
    login: function () {
      var vm = this
      var provider = new firebase.auth.FacebookAuthProvider()
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        vm.token = result.credential.accessToken
        // The signed-in user info.
        vm.user = result.user
        vm.id = result.user.uid.split(':')[1]
        // ...
      }).catch(function (error) {
        var errorCode = error.code
        var errorMessage = error.message
        console.log(errorCode + errorMessage)
      })
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
}

#menu {
  z-index: 999999;
}

p {
  text-align: left;
  font-size: 14px;
  line-height: 1.6;
}

main {
  text-align: center;
  margin-top: 80px;
  margin-bottom: 100px;
}

.print-only {
  visibility: hidden !important;
  display: none !important;
}

@media print {
  .no-print {
    visibility: hidden !important;
    display: none !important;
    height: 0 !important;
  }
  .print-only {
    visibility: visible !important;
    display: block !important;
  }
  img, div, .card, .column {
    page-break-inside: avoid !important;
  }
}

a, button, .clickable {
  cursor: pointer !important;
}

@media screen and (max-width: 600px) {
  main {
    margin-top: 60px;
  }
  .fat-only {
    display: none !important;
  }
  .button {
    max-width: 100% !important;
  }
}

@media screen and (max-width: 991px) {
  .fater-only {
    display: none !important;
  }
}

@media screen and (min-width: 601px) {
  .thin-only {
    display: none !important;
  }
}

.router-link-active {
  background-color: #acf !important;
}

.invisible {
  color: transparent !important;
}

.highlightedText {
  background-color: yellow;
}

#me {
  width: 1.5rem;
  height: 1.5rem;
}

</style>
