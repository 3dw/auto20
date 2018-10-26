<template lang="jade">
  #app
    nav#menu.ui.fixed.top.labeled.icon.inverted.menu
      router-link.item(to="/", exact='') 
        i.home.icon
        | 自學2.0
      router-link.item(to="/cards", exact='') 
        i.comments.icon
        | 自學朋友
      router-link.item(to="/maps", exact='') 
        i.map.icon
        | 地圖
      .right.menu
        a.item(@click="login", v-if="!user")
          i.facebook.icon
          | 登入
        router-link.item(to="/myFlag", v-else)
          img#me.icon(:src = "'http://graph.facebook.com/' + id + '/picture'")
          | 我的旗幟
    main
      router-view(:id = "id", :user="user", @login="login")
</template>

<script>

import firebase from 'firebase/app'
import mix from './mixins/mix.js'

export default {
  name: 'app',
  mixins: [mix],
  data () {
    return {
      user: '',
      token: '',
      id: ''
    }
  },
  methods: {
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
  margin-top: 100px;
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
