<template lang="pug">
  #app
    nav.fixed.top.ui.menu.inverted
      a.item(@click="visible = !visible")
        i.bars.icon
      router-link.item.fat-only(to='/')
        sui-icon(name='home')
        | 首頁
      router-link.item.fat-only(to='/intro')
        sui-icon(name='info')
        | 說明
      router-link.item.fat-only(to='/maps')
        sui-icon(name='map')
        | 地圖
      router-link.item.fat-only(to='/cards')
        sui-icon(name='users')
        | 自學朋友
      .right.menu
        a.item(href="https://github.com/3dw/auto20/issues", target="_blank", rel="noopener noreferrer")
          i.github.icon
          | 錯誤回報
        a.item(v-if="!uid", @click="loginGoogle()")
          i.google.icon
          | Google登入
        .item(v-else)
          img.ui.avatar(:src="photoURL")
          sui-dropdown(icon="angle down")
            sui-dropdown-menu(button, inverted="true")
              sui-dropdown-item
                router-link.ui(to="/myFlag") 我的旗幟
              sui-dropdown-item
                router-link.ui(to="/book") 我的名簿
              sui-dropdown-item(v-for="i in myGroupIdx()", :key="i")
                router-link.ui(:to="'/group/' + i") {{ groups[i].n }}
              sui-dropdown-item
                a.ui(@click="logout()") 登出
                  img.ui.small(:src="photoURL")
    sui-menu(is='sui-sidebar', :visible='visible', animation='overlay', width='thin', icon='labeled', inverted='' vertical='', fixed='')
      sui-menu-item
        router-link(to='/')
          sui-icon(name='home')
          | 首頁
      sui-menu-item
        router-link(to='/intro')
          sui-icon(name='info')
          | 說明
      sui-menu-item
        router-link(to='/maps')
          sui-icon(name='map')
          | 地圖
      sui-menu-item
        router-link(to='/cards')
          sui-icon(name='users')
          | 自學朋友
      sui-menu-item(v-if="uid")
        router-link(to='/myFlag')
          sui-icon(name='edit')
          | 我的旗幟
      sui-menu-item(v-if="uid")
        router-link(to='/myPlace')
          sui-icon(name='flag checkered')
          | 新增地點旗
      sui-menu-item
        router-link(to='/groups')
          sui-icon(name='globe')
          | 社團
      sui-menu-item
        router-link(to='/book')
          sui-icon(name='book')
          | 我的名簿
    sui-sidebar-pushable
      sui-sidebar-pusher
        main
          .ui.form.container(v-if="doSearch($route.path)")
            input(v-autofocus="", v-model="mySearch", placeholder="以關鍵字或年齡搜詢", autofocus)
          router-view(:uid = "uid", :user="user", :groups="groups", :email="email", :users="users", :places="places", :mySearch="mySearch", :provider="provider", :photoURL="photoURL", :cities = "cities", @loginGoogle="loginGoogle", :zoom="zoom", :center="center", :book="book", @locate="locate", @locateCity = "locateCity", @addBook="addBook", @removeBook="removeBook")
        chatbox(@loginGoogle = "loginGoogle", :uid = "uid", :user="user", :photoURL="photoURL")
      // ad
</template>

<script>

import { onValue } from 'firebase/database'
import { auth, usersRef, placesRef, groupsRef } from './firebase'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
const provider = new GoogleAuthProvider()
provider.addScope('https://www.googleapis.com/auth/userinfo.email')
// import firebase from 'firebase/app'
// import 'firebase/auth';
import mix from './mixins/mix.js'
import Chatbox from './components/Chatbox'
// import Ad from './components/Ad-Be'

export default {
  name: 'app',
  mixins: [mix],
  components: { Chatbox },
  // firebase: {
  //  users: usersRef
  // },
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '',
    // all titles will be injected into this template
    titleTemplate: '%s | 自學2.0'
  },
  data () {
    return {
      mySearch: '',
      visible: false,
      zoom: 7,
      center: [22.613220, 121.219482],
      user: '',
      token: '',
      uid: '',
      provider: '',
      photoURL: '',
      email: '',
      book: [],
      users: [],
      places: [],
      groups: [],
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
    myGroupIdx () {
      const vm = this
      return this.groups.filter(function (g) {
        return (g.members || []).indexOf(vm.uid || '') > -1
      }).map(function (g) {
        return g.idx
      })
    },
    doSearch: function (p) {
      return !(p.match(/(drawing|myPlace|myFlag|group\/|place|intro|faq|flag\/\d+|ans\/\d+)/))
    },
    locate: function (h) {
      this.zoom = 13
      this.center = h.latlngColumn.split(',')
      this.$router.push({path: '/maps'})
    },
    locateCity: function (c) {
      // console.log(c)
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
    /* loginFB: function () {
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
        for (var i = 0; i < vm.users.length; i++) {
          if (vm.users[i].uid === vm.uid) {
            vm.center = vm.users[i].latlngColumn.split(',')
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
    }, */
    logout () {
      const vm = this
      auth.signOut().then(function() {
        vm.user = null
        vm.uid = null
        vm.photoURL = null
      })
    },
    isFacebookApp: function () {
      var ua = navigator.userAgent || navigator.vendor || window.opera || ''
      return (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1)
    },
    loginGoogle: function () {
      const vm = this
      if (this.isFacebookApp()) {
        window.open('https://we.alearn.org.tw/')
      } else {
        signInWithPopup(auth, provider)
        .then((result) => {
            // console.log(result)
          // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            // The signed-in user info.
            const user = result.user

            console.log(credential)
            // console.log(token)

            vm.user = user
            vm.email = user.providerData[0].email
            // console.log(vm.email)
            vm.token = token
            // The signed-in user info.
            vm.uid = result.user.uid
            vm.photoURL = decodeURI(result.user.photoURL)
            // console.log(vm.photoURL)
            // console.log(user)

        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          // const email = error.customData.email;
          // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(errorCode);
          console.log(errorMessage);
        });
      }
    }
  },
  mounted () {
    const vm = this
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val()
      // console.log(data)
      vm.users = data
    })
    onValue(placesRef, (snapshot) => {
      const data = snapshot.val()
      // console.log(data)
      vm.places = data
    })
    onValue(groupsRef, (snapshot) => {
      const data = snapshot.val()
      // console.log(data)
      vm.groups = data
    })
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
}

#menu {
  z-index: 1;
}

p {
  text-align: left;
  font-size: 14px;
  line-height: 1.6;
}

main {
  text-align: center;
  margin-top: 80px;
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

img.history {
  width: 100px;
}

.timeline-item .title-item {
  font-size: 22px !important;
}

.timeline-item .description-item {
  font-size: 18px !important;
  color: #333 !important;
  font-weight: normal !important;
}

img.history {
  width: 110px !important;
  float: left !important;
  margin-right: 1em !important;
}

@media screen and (max-width: 420px) {
  img.history {
    width: 100px !important;
  }
}

.timeline .wrapper-item .section-year .year {
  font-size: 20px !important;
}

.ui.left.sidebar, .ui.left.visible.sidebar, .ui.right.visible.sidebar {
  z-index: 9999999;
  margin-top: 2.68em !important;
}

.ui.avatar {
  width: 1em;
  margin: 0;
}

.ui.small {
  width: 3em;
  border-radius: 50%;
}

.ui.inverted.menu {
  border-radius: 0;
  padding: 0;
  margin: 0;
  color: white;
}

</style>
