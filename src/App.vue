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
      router-link.item(to='/cards')
        sui-icon(name='users')
        | 朋友
      router-link.item(to="/groups")
        i.globe.icon
        | 社團
      .right.menu
        a.item.fat-only(href="https://github.com/3dw/auto20/issues", target="_blank", rel="noopener noreferrer")
          i.github.icon
          | 錯誤回報
        a.item(v-if="!uid && !isInApp", @click="loginGoogle()")
          i.google.icon
          | Google登入
        .item(v-if="uid")
          img.ui.avatar(:src="photoURL", referrerpolicy="no-referrer")
          sui-dropdown(icon="angle down")
            sui-dropdown-menu(button, inverted="true")
              sui-dropdown-item
                router-link.ui(to="/myFlag") 我的旗幟
              sui-dropdown-item
                router-link.ui(to="/book") 我的名簿
              sui-dropdown-divider
              sui-dropdown-item(v-for="i in myGroupIdx()", :key="i")
                router-link.ui(:to="'/group/' + i") {{ groups[i].n }}
              sui-dropdown-divider
              sui-dropdown-item
                a.ui(@click="logout()") 登出
                  img.ui.small(:src="photoURL", referrerpolicy="no-referrer")
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
          | 朋友
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
      sui-menu-item
        router-link(to='/outer')
          sui-icon(name='paperclip')
          | 外部連結
    sui-sidebar-pushable
      sui-sidebar-pusher
        main
          .ui.form.container(v-if="doSearch($route.path)")
            input(v-autofocus="", v-model="mySearch", placeholder="以關鍵字或年齡搜詢", autofocus)
          router-view(:uid = "uid", :user="user", :groups="groups", :email="email", :users="users", :places="places", :mySearch="mySearch", :provider="provider", :photoURL="photoURL", :cities = "cities", @loginGoogle="loginGoogle", :zoom="zoom", :center="center", :book="book", @locate="locate", @locateCity = "locateCity", @addBook="addBook", @removeBook="removeBook", :isInApp="isInApp")
    chatbox#ch(@loginGoogle = "loginGoogle", :uid = "uid", :user="user", :photoURL="photoURL")
      // ad
</template>

<script>
import InApp from 'detect-inapp' // 引入檢測應用內瀏覽的庫
import { onValue } from 'firebase/database' // 從 Firebase 引入數據庫讀取功能
import { auth, usersRef, placesRef, groupsRef } from './firebase' // 引入自訂的 Firebase 配置和參考
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth' // 引入 Firebase 身份驗證功能
const provider = new GoogleAuthProvider() // 創建一個 Google 身份驗證提供者
provider.addScope('https://www.googleapis.com/auth/userinfo.email') // 添加需要的權限範圍

// 判斷用戶是否通過某些特定客戶端應用如 Facebook 或 Instagram 來訪問
const inapp = new InApp(navigator.userAgent || navigator.vendor || window.opera)

export default {
  name: 'app',
  mixins: [mix], // 混入其他功能
  components: { Chatbox }, // 註冊 Chatbox 組件
  data () {
    return {
      isInApp: inapp.isInApp, // 檢測是否在應用內
      mySearch: '', // 搜索字符串
      visible: false, // 控制側邊欄的顯示
      zoom: 7, // 地圖縮放級別
      center: [22.613220, 121.219482], // 地圖中心點座標
      user: '', // 用戶信息
      token: '', // 認證令牌
      uid: '', // 用戶 ID
      provider: '', // 身份驗證提供者
      photoURL: '', // 用戶頭像URL
      email: '', // 用戶電子郵箱
      book: [], // 存儲 "我的名簿" 數據
      users: [], // 所有用戶的數據
      places: [], // 所有地點的數據
      groups: [], // 所有團體的數據
      cities: [ // 各大城市的座標和可選的縮放級別
        // 下面列出了一些台灣的主要城市和他們的座標
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
    myGroupIdx () { // 過濾並返回當前用戶所屬的團體索引
      const vm = this
      return this.groups.filter(function (g) {
        return (g.members || []).indexOf(vm.uid || '') > -1
      }).map(function (g) {
        return g.idx
      })
    },
    doSearch: function (p) { // 判斷是否在特定路由進行搜索
      return !(p.match(/(drawing|^\/$|myPlace|outer|myFlag|group\/|place|intro|faq|flag\/\d+|ans\/\d+)/))
    },
    locate: function (h) { // 定位到特定坐標
      this.zoom = 13
      this.center = h.latlngColumn.split(',')
      this.$router.push({path: '/maps'})
    },
    locateCity: function (c) { // 定位到選定的城市
      this.zoom = c.z || 13
      this.center = c.c
    },
    getLocal: function (n) { // 從本地存儲獲取數據
      console.log('get:' + n)
      this[n] = JSON.parse(this.$localStorage.get(n))
    },
    setLocal: function (n) { // 將數據保存到本地存儲
      console.log('set:' + n)
      this.$localStorage.set(n, JSON.stringify(this[n]))
    },
    addBook: function (uid) { // 添加用戶到 "我的名簿"
      if (this.book.indexOf(uid) === -1) {
        this.book.push(uid)
        this.setLocal('book')
      }
    },
    removeBook: function (index) { // 從 "我的名簿" 移除用戶
      this.book.splice(index, 1)
      this.setLocal('book')
    },
    logout () { // 處理用戶登出
      const vm = this
      auth.signOut().then(function() {
        vm.user = null
        vm.uid = null
        vm.photoURL = null
      })
    },
    loginGoogle: function () { // 處理 Google 登入
      const vm = this
      if (this.isInApp) {
        window.alert('本系統不支援facebook, link等app內部瀏覽，請用一般瀏覽器開啟，方可登入，謝謝')
      } else {
        signInWithPopup(auth, provider).then((result) => {
          // 處理登入成功後的信息
          const credential = GoogleAuthProvider.credentialFromResult(result)
          const token = credential.accessToken
          const user = result.user
          vm.user = user
          vm.email = user.providerData[0].email
          vm.token = token
          vm.uid = user.uid
          vm.photoURL = decodeURI(user.photoURL)
          if (vm.uid && vm.users[vm.uid]) {
            vm.user = vm.users[vm.uid]
          }
        })
      }
    }
  },
  mounted () { // 組件掛載後的初始化操作
    const vm = this
    console.log(vm.isInApp)
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val()
      vm.users = data
    })
    onValue(placesRef, (snapshot) => {
      const data = snapshot.val()
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

#ch {
  position: fixed;
  right: 0;
  bottom: 0;
}

</style>
