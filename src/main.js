// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './firebase'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import VueResource from 'vue-resource'
import VueLocalStorage from 'vue-localstorage'
import infiniteScroll from 'vue-infinite-scroll'
import autofocus from 'vue-autofocus-directive'
import VueGtag from 'vue-gtag'
import VueSimpleMarkdown from 'vue-simple-markdown'
import { rtdbPlugin } from 'vuefire'
import './registerServiceWorker'
import '../node_modules/timeline-vuejs/dist/timeline-vuejs.css'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)
Vue.use(rtdbPlugin)
// import alts from 'html-img-alt'

Vue.use(VueSimpleMarkdown)

Vue.use(VueGtag, {
  config: { id: 'UA-26178243-9' }
}, router)

Vue.directive('autofocus', autofocus)

delete L.Icon.Default.prototype._getIconUrl
// eslint-disable-next-line
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

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
