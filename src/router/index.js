import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
// import Work from '@/components/Work'
import Intro from '@/components/Intro'
import Cards from '@/components/Cards'
import Maps from '@/components/Maps'
import Flag from '@/components/Flag'
import Place from '@/components/Place'
import MyFlag from '@/components/MyFlag'
import Groups from '@/components/Groups'
import Group from '@/components/Group'
import Book from '@/components/Book'
import MyMap from '@/components/MyMap'
import MyPlace from '@/components/MyPlace'
import Faq from '@/components/Faq'
import Ans from '@/components/Ans'
import History from '@/components/History'
import Drawing from '@/components/Drawing'
import Outer from '@/components/Outer'

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
      path: '/outer',
      name: 'Outer',
      component: Outer
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
      path: '/flag/:uid',
      name: 'Flag',
      component: Flag
    },
    {
      path: '/place/:idx',
      name: 'Place',
      component: Place
    },
    {
      path: '/group/:idx',
      name: 'Group',
      component: Group
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
    },
    {
      path: '/myplace',
      name: 'MyPlace',
      component: MyPlace
    },
    {
      path: '/history',
      name: 'History',
      component: History
    },
    {
      path: '/drawing',
      name: 'Drawing',
      component: Drawing
    }
  ]
})
