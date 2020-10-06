<template lang="pug">
  .hello
    h1
      router-link(to="/cards", v-if="book && !book.length") 您的名簿目前沒有人，按此找朋友
    loader(v-show="!hands.length")
    .ui.divider
    l-map(style="width: 100%; height: 600px;" ref="myMap", :zoom="myZoom", :center="center")
      l-tile-layer(:url="url", :attribution="attribution")
      l-marker(v-for = "(h, index) in searchBy(hands, mySearch)", :key="index" , :lat-lng="countLatLng(h)", @click="$router.push({ path: '/flag/' + h.uid })", :icon="getAnIcon(h)", v-if="book && book.indexOf(h.id) > -1")
        l-popup {{h.name}}
</template>

<script>

import * as L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Loader from './Loader'

export default {
  name: 'mymap',
  mixins: [mix],
  props: ['mySearch', 'zoom', 'center', 'book'],
  components: {LMap, LTileLayer, LMarker, LPopup, Loader},
  data () {
    return {
      myZoom: 13,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      hands: []
    }
  },
  firebase: {
    hands: handsRef
  },
  methods: {
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

img.leaflet-marker-icon {
  border-radius: 50% !important;
  border: 1px solid purple !important;
}

</style>
