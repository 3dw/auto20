<template lang="pug">
  .hello
    .ui.container
      form#main-form.ui.form.error.warning.success
        h2.ui.header 請填表
        .sub.header
          | 為了讓人真的能找到夥伴
          br
          | 有標記紅色星號
          i.red.star
          | 的欄位為必填
        h4.ui.dividing.header 關於場地
        .field
          label.required 名字
          input(type='text' v-model='root.name', placeholder='場地名稱')
        .field(v-bind:class="{error: root.address && (root.latlngColumn == 'undefined,undefined' || root.latlngColumn == '36.778261,-119.4179324')} ")
          label.required 概略地址
          input(v-model.trim='root.address', @keyup='checkLatLng(root.address)', placeholder='地址愈詳細，別人愈好認識你的所在')

          span(v-show="root.address && root.latlngColumn !== 'undefined,undefined' && root.latlngColumn !== '36.778261,-119.4179324'")
            span(v-html='root.latlngColumn')
            a(:href="'https://www.google.com.tw/maps/search/' + root.address" target="_blank") &nbsp;&nbsp;看地圖測試

          .ui.error.message(v-show="(root.address && (root.latlngColumn == 'undefined,undefined' || root.latlngColumn == '36.778261,-119.4179324'))")
            .header 無法定位
            p 如果您有不只一個住處，請填寫一個就好，其他可寫進自我介紹中。
              br
              | 若持續無法定位，請
              a(href="https://www.google.com.tw/chrome/browser/desktop/" target="_blank") 使用Chrome瀏覽器
              | 再試一次。
          .ui.warning.message(v-show="usedAddr(root)")
            .header 地址重疊
            p 有別人使用了這個地址。您可以加上村里或是路段，來使定位更精準

        .ui.divider
        .field
          label 網址
          .two.fields
            .field 
              input(v-model='root.site', placeholder='場地網址')
              span(v-show='root.site')
                a(:href='root.site', target='_blank')
                  img(:src="'http://www.google.com/s2/favicons?domain=' + root.site" title='場地網址' alt='場地網址')
                  | 測試連結

        .two.fields
          .field
            label.required 有效聯絡方式
            input(type='text' v-model='root.connect_me',  placeholder='可公開的方式，如e-mail。臉書私訊不可')
          .ui.divider
          .field
            label.required 介紹
            textarea#note(v-model='root.note', rows='5', cols='30', placeholder='介紹很重要，請寫20字以上，謝謝')
      .ui.divider
      a.ui.large.blue.button(@click="updateFlag")
        span 升起旗幟!!
</template>

<script>

import { placesRef, handsRef, db } from '../firebase'
import mix from '../mixins/mix.js'
import Loader from './Loader'

export default {
  name: 'myflag',
  mixins: [mix],
  props: ['uid', 'user', 'mySearch', 'provider', 'photoURL'],
  components: { Loader },
  data () {
    return {
      myIndex: -1,
      root: {},
      local: {},
      hands: [],
      places: []
    }
  },
  firebase: {
    places: placesRef,
    hands: handsRef
  },
  methods: {
    checkLatLng: function (add) {
      var vm = this
      console.log('checkLatLng:' + add)
      this.$http.get('https://api.opencagedata.com/geocode/v1/json?q=' + encodeURIComponent(add) + '&key=ee2340e9a9e146e090943337d14a76d4&language=zh&pretty=1').then(response => {
        var d = response.body
        console.log(d)
        var lat, lng
        try {
          lat = d.results[0].bounds.northeast.lat
          lng = d.results[0].bounds.northeast.lng
        } catch (e$) {
          console.log(e$)
        }
        if (!lat || !lng) {
          try {
            lat = d.query.results.Result.latitude
            lng = d.query.results.Result.longitude
          } catch (e$) {
            console.log(e$)
          }
        }
        vm.root.latlngColumn = lat + ',' + lng
        vm.local.lat = parseFloat(lat)
        vm.local.lng = parseFloat(lng)
      })
    },
    usedAddr: function (hand) {
      var ans, i$, ref$, len$, h
      ans = false
      for (i$ = 0, len$ = (ref$ = this.hands.filter(fn$)).length; i$ < len$; ++i$) {
        h = ref$[i$]
        if (h.latlngColumn === hand.latlngColumn) {
          ans = true
          break
        }
      }
      if (hand.latlngColumn === 'undefined,undefined' || hand.latlngColumn === '36.778261,-119.4179324') {
        ans = false
      }
      return ans
      function fn$ (o) {
        return o.name !== hand.name
      }
    },
    tooDetail: function (addr) {
      if (!addr) {
        return false
      }
      if (addr.match(/(號|樓|F|f)/)) {
        return true
      }
      return false
    },
    updateFlag: function () {
      this.root.lastUpdate = (new Date()).getTime()
      this.root.idx = this.myIndex
      this.myIndex = this.places.length
      if (this.myIndex < this.places.length) {
        db.ref('places/' + this.myIndex).update(JSON.parse(JSON.stringify(this.root).replace('.key', 'key').replace('undefined', 'null')))
        alert('更新成功!')
      } else {
        console.log('new2')
        db.ref('places/' + this.myIndex).set(JSON.parse(JSON.stringify(this.root).replace('.key', 'key').replace('undefined', 'null')))
        alert('登錄成功!')
      }
    },
    loginFB: function () {
      this.$emit('loginFB')
    },
    loginGoogle: function () {
      this.$emit('loginGoogle')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

label.required::before {
  content: "*";
  color:red;
}

i.red.star::before{
  content: "*";
  color:red;    
}

</style>
