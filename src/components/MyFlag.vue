<template lang="jade">
  .hello
    .ui.container(v-if="id")
      form#main-form.ui.form.error.warning.success
        h2.ui.header 請填表
        .sub.header
          | 為了讓人真的能找到夥伴，有標記紅色星號
          i.red.star
          | 的欄位為必填
        h4.ui.dividing.header 關於我
        .field
          label.required 名字
          input(type='text' v-model='myHand.name', placeholder='您的大名')
        .field(v-bind:class="{error: myHand.address && (myHand.latlngColumn == 'undefined,undefined' || myHand.latlngColumn == '36.778261,-119.4179324')} ")
          label.required 概略地址
          input(v-model='myHand.address', @change='checkLatLng(myHand.address,n)', placeholder='地址愈詳細，別人愈好認識你的所在')

          span(v-show="myHand.address && myHand.latlngColumn !== 'undefined,undefined' && myHand.latlngColumn !== '36.778261,-119.4179324'")
            span(v-html='myHand.latlngColumn')
            a(:href="'https://www.google.com.tw/maps/search/' + myHand.address" target="_blank") &nbsp;&nbsp;看地圖測試

          .ui.error.message(v-show="(myHand.address && (myHand.latlngColumn == 'undefined,undefined' || myHand.latlngColumn == '36.778261,-119.4179324'))")
            .header 無法定位
            p 如果您有不只一個住處，請填寫一個就好，其他可寫進自我介紹中。
              br
              | 若持續無法定位，請
              a(href="https://www.google.com.tw/chrome/browser/desktop/" target="_blank") 使用Chrome瀏覽器
              | 再試一次。

        a.ui.massive.green.button(@click="updateFlag") 更新旗幟
</template>

<script>

import { handsRef, db } from '../firebase'
import mix from '../mixins/mix.js'

export default {
  name: 'hello',
  mixins: [mix],
  props: ['id'],
  data () {
    return {
      mySearch: '',
      myIndex: -1,
      myHand: {},
      local: {}
    }
  },
  firebase: {
    hands: handsRef
  },
  methods: {
    setMe: function () {
      for (var i = 0; i < this.hands.length; i++) {
        if (this.hands[i].id === this.id) {
          this.myIndex = i
          this.myHand = this.hands[i]
        }
      }
      if (this.id && this.myIndex === -1) { this.myIndex = this.hands.length }
    },
    checkLatLng: function (add, n) {
      var vm = this
      console.log('checkLatLng:' + add)
      this.$http.get('http://cors-anywhere.herokuapp.com/http://open.mapquestapi.com/geocoding/v1/address?key=KEY&location=' + encodeURIComponent(add) + ',CA&sensor=false').then(response => {
        var d = response.body
        console.log(d)
        var lat, lng
        try {
          lat = d.results[0].geometry.location.lat
          lng = d.results[0].geometry.location.lng
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
        vm.myHand.latlngColumn = lat + ',' + lng
        vm.local.lat = parseFloat(lat)
        vm.local.lng = parseFloat(lng)
      })
    },
    updateFlag: function () {
      this.myHand.lastUpdate = (new Date()).getTime()
      if (this.myIndex < this.hands.length) {
        db.ref('hands/' + this.myIndex).update(JSON.parse(JSON.stringify(this.myHand).replace('.key', 'key').replace('undefined', 'null')))
        alert('更新成功!')
      } else {
        db.ref('hands/' + this.myIndex).set(JSON.parse(JSON.stringify(this.myHand).replace('.key', 'key').replace('undefined', 'null')))
        alert('登錄成功!')
      }
    }
  },
  mounted () {
    setTimeout(this.setMe, 500)
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
