import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Cards from '@/components/Cards'
import Maps from '@/components/Maps'
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
      path: '/maps',
      name: 'Maps',
      component: Maps
    },
    {
      path: '/flag/:id',
      name: 'Flag',
      component: Flag
    }
  ]
})
