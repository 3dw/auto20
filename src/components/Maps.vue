<template lang="jade">
  .hello
    loader(v-show="!hands.length")
    .ui.divider

    .ui.grid
      .ui.stackable.row
        .sixteen.wide.column
          l-map(style="width: 100%; height: 600px;" ref="myMap", :zoom="zoom", :center="center")
            l-tile-layer(:url="url", :attribution="attribution")
            l-marker(v-for = "(h, index) in searchBy(hands, mySearch)", :key="index" , :lat-lng="countLatLng(h)", @click="$router.push({ path: '/flag/' + h.uid })", :icon="getAnIcon(h)")
              l-popup {{h.name}}
</template>

<script>

import * as L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Loader from './Loader'

export default {
  name: 'maps',
  mixins: [mix],
  props: ['mySearch', 'zoom', 'center', 'cities'],
  components: {LMap, LTileLayer, LMarker, LPopup, Loader},
  data () {
    return {
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
    countLatLng: function (h) {
      if (!h.latlngColumn) { return {lat: 0, lng: 0} }
      return {lat: h.latlngColumn.split(',')[0], lng: h.latlngColumn.split(',')[1]}
    },
    getAnIcon: function (h) {
      return L.icon({
        iconUrl: this.getIcon(h),
        alt: h.name,
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

</style>
