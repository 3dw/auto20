// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './firebase'
import VueFire from 'vuefire'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import VueResource from 'vue-resource'
import VueLocalStorage from 'vue-localstorage'
import infiniteScroll from 'vue-infinite-scroll'

delete L.Icon.Default.prototype._getIconUrl
// eslint-disable-next-line
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.use(VueFire)
Vue.use(VueResource)
Vue.use(VueLocalStorage)
Vue.use(infiniteScroll)

require('semantic-ui-css/semantic.css')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
