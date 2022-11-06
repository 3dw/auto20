<template lang="pug">
  .hello
    //h1.ui.header
      img(src="../assets/usershake0.png")
      | {{msg}} {{user && user.providerData[0].displayName}}
      img(src="../assets/usershake0.png")
    h4.ui.header 請先登入，和
      span(v-if = "users") {{ toList(users).length }}
      span(v-else) 各
      | 位朋友相互認識，升起互助旗
      span(v-if ="!user")
    .ui.huge.buttons
      router-link(to="/intro").ui.purple.button 瞭解更多
      button.ui.orange.button(@click="loginGoogle", v-if="!user")
        i.google.icon
        | 登入
      router-link.ui.blue.button(to="/myFlag", v-else)
        | 前往我的旗幟
    .ui.divider
    p 本系統不支援facebook, link等app內部瀏覽，請用一般瀏覽器開啟，方可登入，謝謝
    .ui.divider
    h2(v-if="users && users.length") 最近更新
    .ui.two.doubling.cards.container(v-if="users")
      .ui.card(v-for="(h, index) in list.slice(0, 2)", :key="index")
        card(:h="h", :full="true", :mySearch="mySearch", :uid="uid || ''", :book="book", @locate="locate", @addBook="addBook", @removeBook="removeBook")
    .ui.container(v-if="users")
      .ui.dividder
      h2 地圖
      .ui.grid
        .ui.stackable.row
          .six.wide.column
            .ui.button.group
              a.ui.green.button(v-for="c in cities", @click="locateCity(c)") {{c.t}}
          .ten.wide.column
            l-map(style="width: 100%; height: 600px;" ref="myMap", :zoom="zoom", :center="center")
              l-tile-layer(:url="url", :attribution="attribution")
              l-marker(v-for = "(h, index) in searchBy(users, mySearch)", :key="index" , :lat-lng="countLatLng(h)", @click="$router.push({ path: '/flag/' + h.uid })", :icon="getAnIcon(h)")
                l-popup {{h.name}}

</template>

<script>

import mix from '../mixins/mix.js'
import Card from './Card'
import * as L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

export default {
  name: 'hello',
  components: {Card, LMap, LTileLayer, LMarker, LPopup},
  props: ['uid', 'user', 'zoom', 'center', 'mySearch', 'photoURL', 'book', 'users', 'places', 'cities'],
  mixins: [mix],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '歡迎',
  },
  data () {
    return {
      msg: '歡迎',
      url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  computed: {
    list: function () {
      function toList (obj) {
        const ks = Object.keys(obj)
        return ks.map(function (k) {
          return obj[k]
        })
      }
      var l = toList(this.users).concat(toList(this.places)).slice().sort(function(a,b) {
        if (!b.lastUpdate || isNaN(b.lastUpdate)) { return -1}
        return b.lastUpdate - a.lastUpdate
      })
      return l
    }
  },
  // firebase: {
  //   users: usersRef,
  //   places: placesRef
  // },
  methods: {
    toList (obj) {
      const ks = Object.keys(obj)
      return ks.map(function (k) {
        return obj[k]
      })
    },
    locateCity: function (c) {
      this.$emit('locateCity', c)
    },
    loginFB: function () {
      this.$emit('loginFB')
    },
    loginGoogle: function () {
      this.$emit('loginGoogle')
    },
    isFacebookApp: function () {
      var ua = navigator.userAgent || navigator.vendor || window.opera || ''
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
    },
    countLatLng: function (h) {
      if (!h.latlngColumn) { return {lat: 0, lng: 0} }
      return {lat: h.latlngColumn.split(',')[0], lng: h.latlngColumn.split(',')[1]}
    },
    getAnIcon: function (h) {
      return L.icon({
        iconUrl: this.getIcon(h),
        shadowUrl: '',
        iconSize: [50, 50], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0], // the same for the shadow
        popupAnchor: [0, 0] // point from which the po
      })
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.ui.avatar {
  max-height: 100px;
  max-width: 100px;
  border-radius: 50%;
}

img.leaflet-marker-icon {
  border-radius: 50% !important;
  border: 1px solid purple !important;
}

p {
  text-align: center;
}

</style>
