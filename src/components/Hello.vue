<template lang="jade">
  .hello
    h1.ui.header
      img(src="../assets/handshake0.png")
      | {{msg}} {{user && user.providerData[0].displayName}}
      img(src="../assets/handshake0.png")
    h4.ui.header 升上互助旗，和
      span(v-if = "hands && hands.length") {{ hands.length }}
      span(v-else) 各
      | 位朋友相互認
      span(v-if ="!user") (請先登入)
    h4.ui.header
      router-link(to="/intro").ui.purple.button 瞭解更多

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
      | 前往我的旗幟
    a.ui.massive.red.button(v-if="isFacebookApp()", href="https://www.playpcesor.com/2014/11/facebook-app-15.html", target="_blank")
      | 按右上的...用瀏覽器開啟
    .ui.divider
    h2(v-if="hands.length") 最近更新 
    .ui.two.doubling.cards.container
      .ui.card(v-for="(h, index) in searchBy(hands, mySearch).slice(0, 2)", :key="index")
        card(:h="h", :full="false", :mySearch="mySearch", :id="id", :book="book", @locate="locate", @addBook="addBook", @removeBook="removeBook")
    .ui.container(v-if="hands.length")
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
              l-marker(v-for = "(h, index) in searchBy(hands, mySearch)", :key="index" , :lat-lng="countLatLng(h)", @click="$router.push({ path: '/flag/' + h.id })", :icon="getAnIcon(h)")
                l-popup {{h.name}}

</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Card from './Card'
import * as L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

export default {
  name: 'hello',
  components: {Card, LMap, LTileLayer, LMarker, LPopup},
  props: ['id', 'user', 'zoom', 'center', 'mySearch', 'photoURL', 'book', 'cities'],
  mixins: [mix],
  data () {
    return {
      msg: '歡迎',
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  firebase: {
    hands: handsRef
  },
  methods: {
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

</style>
