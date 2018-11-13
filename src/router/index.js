import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Intro from '@/components/Intro'
import Cards from '@/components/Cards'
import Maps from '@/components/Maps'
import Flag from '@/components/Flag'
import MyFlag from '@/components/MyFlag'
import Groups from '@/components/Groups'
import Book from '@/components/Book'
import MyMap from '@/components/MyMap'
import Faq from '@/components/Faq'
import Ans from '@/components/Ans'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/intro',
      name: 'Intro',
      component: Intro
    },
    {
      path: '/faq',
      name: 'Faq',
      component: Faq
    },
    {
      path: '/ans/:id',
      name: 'Ans',
      component: Ans
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
    },
    {
      path: '/myFlag',
      name: 'MyFlag',
      component: MyFlag
    },
    {
      path: '/groups',
      name: 'Groups',
      component: Groups
    },
    {
      path: '/book',
      name: 'Book',
      component: Book
    },
    {
      path: '/mymap',
      name: 'MyMap',
      component: MyMap
    }
  ]
})
