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
        router-link.item(to="/myFlag", v-if="user")
          img#me.icon(:src = "photoURL || 'http://graph.facebook.com/' + id + '/picture'")
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
        router-link.item(to="/myFlag", v-if="user")
          img#me.icon(:src = "photoURL || 'http://graph.facebook.com/' + id + '/picture'")
          | 我的旗幟
    chatbox(v-if="id", :id="id", :user="user", :photoURL="photoURL")
    main
      router-view(:id = "id", :user="user", :provider="provider", :photoURL="photoURL", @loginFB="loginFB", @loginGoogle="loginGoogle", :zoom="zoom", :center="center", @locate="locate")
      .ui.form.container(v-if="doSearch($route.path)")
        input(v-model="mySearch", placeholder="以關鍵字或年齡搜詢", autofocus)
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
      zoom: 7,
      center: [22.613220, 121.219482],
      user: '',
      token: '',
      id: '',
      provider: '',
      photoURL: ''
    }
  },
  methods: {
    doSearch: function (p) {
      return (!(p.match(/^\/(myFlag|groups|flag\/\d+)?$/)))
    },
    locate: function (h) {
      this.zoom = 13
      this.center = h.latlngColumn.split(',')
      this.$router.push({path: '/maps'})
    },
    loginFB: function () {
      var vm = this
      var provider = new firebase.auth.FacebookAuthProvider()
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        vm.provider = 'facebook'
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
    },
    loginGoogle: function () {
      var vm = this
      var provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        vm.provider = 'google'
        vm.token = result.credential.accessToken
        // The signed-in user info.
        vm.id = result.user.uid
        vm.user = result.user
        vm.photoURL = vm.user.photoURL
        console.log(vm.user)
        // ...
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
        console.log(errorCode + errorMessage + email + credential)
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
