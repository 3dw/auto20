import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Cards from '@/components/Cards'
import Map from '@/components/Map'
import Flag from '@/components/Flag'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/cards',
      name: 'Cards',
      component: Cards
    },
    {
      path: '/map',
      name: 'Map',
      component: Map
    },
    {
      path: '/flag/:id',
      name: 'Flag',
      component: Flag
    }
  ]
})
