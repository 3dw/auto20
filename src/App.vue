<template lang="jade">
  #app
    nav#menu.ui.fixed.top.inverted.menu.thin-only
      router-link.item(to="/", exact='') 
        i.home.icon
      router-link.item(to="/cards", exact='') 
        i.users.icon
      router-link.item(to="/maps", exact='') 
        i.map.icon
      router-link.item(to="/groups", exact='') 
        i.globe.icon
      router-link.item(to="/faq", exact='')
        i.phone.icon
      .right.menu
        router-link.item(to="/book")
          i.book.icon
        router-link.item(to="/myFlag", v-if="user")
          | 我
    nav#menu.ui.fixed.top.labeled.icon.inverted.menu.fat-only
      router-link.item(to="/", exact='') 
        i.home.icon
        | 自學2.0
      router-link.item(to="/intro", exact='') 
        i.question.icon
        | 使用說明
      router-link.item(to="/cards", exact='') 
        i.users.icon
        | 自學朋友
      router-link.item(to="/maps", exact='') 
        i.map.icon
        | 地圖
      router-link.item(to="/groups", exact='') 
        i.globe.icon
        | 自學社團
      router-link.item(to="/faq", exact='')
        // a.item(href="http://map.alearn.org.tw", target="_blank")
        i.phone.icon
        | 聊天機器人
      .right.menu
        router-link.item(to="/book")
          i.book.icon
          | 我的名簿
          .red.note {{ book.length }}
        router-link.item(to="/mymap", v-if="user")
          i.map.icon
          | 我的地圖
        router-link.item(to="/myFlag", v-if="user")
          i.user.icon
          | 我的旗幟
    chatbox(:uid="uid", :user="user", :photoURL="photoURL", @loginFB="loginFB", @loginGoogle="loginGoogle")
    main
      .ui.form.container(v-if="doSearch($route.path)")
        input(v-autofocus="dynamicvalue", v-model="mySearch", placeholder="以關鍵字或年齡搜詢", autofocus)
      transition(name='fade', mode='out-in')
        router-view(:uid = "uid", :user="user", :mySearch="mySearch", :provider="provider", :photoURL="photoURL", :cities = "cities", @loginFB="loginFB", @loginGoogle="loginGoogle", :zoom="zoom", :center="center", :book="book", 
      @locate="locate", @locateCity = "locateCity", @addBook="addBook", @removeBook="removeBook")
</template>

<script>

import { handsRef } from './firebase'
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
  firebase: {
    hands: handsRef
  },
  data () {
    return {
      zoom: 7,
      center: [22.613220, 121.219482],
      user: '',
      token: '',
      uid: '',
      provider: '',
      photoURL: '',
      book: [],
      cities: [
        {t: '臺北市', c: [25.046337, 121.517444]},
        {t: '新北市', c: [25.011709, 121.465881], z: 10},
        {t: '桃園市', c: [24.993923, 121.301680]},
        {t: '臺中市', c: [24.163162, 120.647828]},
        {t: '臺南市', c: [22.991235, 120.184982]},
        {t: '高雄市', c: [22.627277, 120.301437]},
        {t: '宜蘭縣', c: [24.69295, 121.7195], z: 10},
        {t: '南投縣', c: [23.83876, 120.9876], z: 10},
        {t: '嘉義市', c: [23.47545, 120.4473], z: 10},
        {t: '花蓮縣', c: [23.7569, 121.3542], z: 10},
        {t: '臺東縣', c: [22.98461, 120.9876], z: 10},
        {t: '澎湖縣', c: [23.56548, 119.6151], z: 9}
      ]
    }
  },
  methods: {
    doSearch: function (p) {
      return (!(p.match(/^\/(myFlag|groups|intro|faq|flag\/\d+|ans\/\d+)?$/)))
    },
    locate: function (h) {
      this.zoom = 13
      this.center = h.latlngColumn.split(',')
      this.$router.push({path: '/maps'})
    },
    locateCity: function (c) {
      this.zoom = c.z || 13
      this.center = c.c
    },
    getLocal: function (n) {
      console.log('get:' + n)
      this[n] = JSON.parse(this.$localStorage.get(n))
    },
    setLocal: function (n) {
      console.log('set:' + n)
      this.$localStorage.set(n, JSON.stringify(this[n]))
      // console.log(this.$localStorage.get(n))
    },
    addBook: function (uid) {
      if (this.book.indexOf(uid) === -1) {
        this.book.push(uid)
        this.setLocal('book')
      }
    },
    removeBook: function (index) {
      this.book.splice(index, 1)
      this.setLocal('book')
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
        vm.uid = result.user.uid
        vm.photoURL = vm.user.photoURL
        for (var i = 0; i < vm.hands.length; i++) {
          if (vm.hands[i].uid === vm.uid) {
            vm.center = vm.hands[i].latlngColumn.split(',')
            vm.zoom = 13
            console.log(vm.uid)
          }
        }
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
        vm.uid = result.user.uid
        console.log(vm.uid)
        vm.user = result.user
        console.log(decodeURI(result.user.photoURL))
        decodeURI(result.user.photoURL)
        vm.photoURL = decodeURI(result.user.photoURL)
        for (var i = 0; i < vm.hands.length; i++) {
          console.log(vm.uid)
          console.log(vm.hands[i].uid)
          if (vm.hands[i].uid === vm.uid) {
            vm.center = vm.hands[i].latlngColumn.split(',')
            vm.zoom = 13
          }
        }
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
  },
  mounted () {
    // console.log(this.$localStorage.get(n))
    if (this.$localStorage.get('book')) {
      this.getLocal('book')
    }
  },
  watch: {
    $route (to, from) {
      console.log(from.path)
      console.log(to.path)
      this.$gtag.event('action', {
        event_category: 'navigate',
        event_action: 'from:' + from.path + ' to:' + to.path,
        event_label: 'from:' + from.path + ' to:' + to.path,
        value: 'from:' + from.path + ' to:' + to.path
      })
    }
  }
}
</script>

<style lang="scss">

@mixin keyframes($animation-name) {
    @-webkit-keyframes #{$animation-name} {
        @content;
    }
    @-moz-keyframes #{$animation-name} {
        @content;
    }  
    @-ms-keyframes #{$animation-name} {
        @content;
    }
    @-o-keyframes #{$animation-name} {
        @content;
    }  
    @keyframes #{$animation-name} {
        @content;
    }
}

@mixin animation($str) {
  -webkit-animation: #{$str};
  -moz-animation: #{$str};
  -ms-animation: #{$str};
  -o-animation: #{$str};
  animation: #{$str};      
}

@mixin transition($args...) {
  -webkit-transition: $args;
  -moz-transition: $args;
  -ms-transition: $args;
  -o-transition: $args;
  transition: $args;
}

@mixin transform($transforms) {
     -moz-transform: $transforms;
       -o-transform: $transforms;
      -ms-transform: $transforms;
  -webkit-transform: $transforms;
          transform: $transforms;
}

.fade-leave {  }

.fade-leave-active {
  @include transition(all .3s ease);
  opacity: 0;
}

.fade-enter {
  opacity: 0;
  @include transform(rotateY(45deg));
}

.fade-enter-active {
  @include transition(all .5s ease-in);
}

body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif,
               'Microsoft JhengHei',
                'Microsoft YaHei',
                'STHeiti',
                'Apple LiGothic Medium';
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

.red.note {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 10px;
  top: 0px;
  font-size: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: red;
}

img.leaflet-marker-icon {
  border-radius: 50% !important;
  border: 1px solid purple !important;
  background-color: white !important;
}

</style>
