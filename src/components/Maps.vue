<template lang="jade">
  .hello
    l-map(style="width: 100%; height: 600px;" ref="map", :zoom="7", :center="[22.413220, 121.219482]")
      l-tile-layer(:url="url", :attribution="attribution")
      l-marker(v-for = "(h,index) in hands", :lat-lng="countLatLng(h)" @click="$router.push({ path: '/flag/' + index })")
        l-popup {{h.name}}
</template>

<script>

import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'

export default {
  name: 'map',
  mixins: [mix],
  components: {LMap, LTileLayer, LMarker, LPopup},
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
    countLatLng: function (h) {
      if (!h.latlngColumn) { return {lat: 0, lng: 0} }
      return {lat: h.latlngColumn.split(',')[0], lng: h.latlngColumn.split(',')[1]}
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
</style>
