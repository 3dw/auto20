<template lang="pug">
  .hello
    loader(v-show="!users")
    p(v-if="isInApp") 本系統不支援facebook, link等app內部瀏覽，請用一般瀏覽器開啟，方可登入，謝謝
    .ui.massive.blue.button(v-if="uid && !root.name && users" @click="setMe()") 按此開始
    .ui.huge.buttons(v-if="!user")
      //button.ui.blue.button(@click="loginFB")
        i.facebook.icon
        | 登入 
      //.or
      button.ui.orange.button(@click="loginGoogle")
        i.google.icon
        | 登入 
    .ui.container(v-if="root.name")
      form#main-form.ui.form.error.warning.success
        h2.ui.header 請填表
        .sub.header
          | 為了讓人真的能找到夥伴
          br
          | 有標記紅色星號
          i.red.star
          | 的欄位為必填
        h4.ui.dividing.header 關於我
        .field
          label.required 名字
          input(type='text' v-model='root.name', placeholder='您的大名')
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

          .ui.warning.message(v-show="tooDetail(root.address)")
            .header 地址太詳細了
            p 這是公開資料，最細寫到路段即可，請不要寫出門牌號碼。

        .ui.divider
        .field
          label 網址
          .two.fields
            .field 
              input(v-model='root.site', placeholder='個人網址')
              span(v-show='root.site')
                a(:href='root.site', target='_blank')
                  img(:src="'https://www.google.com/s2/favicons?domain=' + root.site" title='個人網址' alt='個人網址')
                  | 測試連結
            .field
              input(v-model='root.site2', placeholder='參與的社群網址')
              span(v-show='root.site2')
                a(v-show='root.site2', :href='root.site2', target='_blank')
                  img(:src="'https://www.google.com/s2/favicons?domain=' + root.site2" title='社群網址' alt='社群網址')
                  | 測試連結

        .two.fields
          .field
            label.required 有效聯絡方式
            input(type='text' v-model='root.connect_me',  placeholder='可公開的方式，如e-mail。臉書私訊不可')
          .field
            label 比較有空的時段
            input(type='text', v-model='root.freetime', placeholder='例如：週五下午和週末')
        h4.ui.dividing.header 社交資訊
        .field
          label 您的身份
          select.selectpicker(v-model='root.learner_role')
            // TODO : NG-OPTION
            option(value='')  -- 選擇一種自學身份 -- 
            option(v-for="t in ['自學生', '自學家長', '獨立教育工作者','自學家長 + 獨立教育工作者', '自學生 + 獨立教育工作者', '自學生 + 自學家長','自學生 + 自學家長 + 獨立教育工作者']", :selected='root.learner_role == t', :value="t") {{t}}
        .field
          label 主要的自學型態
          select.selectpicker(v-model='root.learner_type')
            option(value='')  -- 選擇一種自學型態 -- 
            option(v-for="t in ['個人','三五好友','團體共學','類學校機構']", :selected='root.learner_type == t', :value="t") {{t}}
        .field(v-bind:class="{error:badAge(root.learner_birth), warning:!root.learner_birth}")

          label.required 您的出生年次(西元)
          input(v-model='root.learner_birth', type='text', placeholder='您自己的年次，如1976')

        span(v-show='root.learner_birth') 大約{{toAge(root.learner_birth)}}歲

        .ui.warning.message(v-show="!root.learner_birth")
          .header 請填出生年份
          p 這是為了尋友用，如果您不願意填真實年份，可以增減1~2歲。

        .ui.error.message(v-show="badAge(root.learner_birth)")
          .header 無法計算年歲
          p 
           | 出生年(西元)的欄位僅能填寫數字喔

        .field
          label 孩子的出生年次(西元)，若還沒有孩子或還不需找共學夥伴可略過本項
          span
            input(v-model='root.child_birth', type='text', placeholder='最大孩子的出生年次(西元)')
            br
            span(v-show='root.child_birth') 大約{{toAge(root.child_birth)}}歲
            .ui.divider
            span(style="margin-left:15px;") 若您有多位孩子，請再填寫：
              br
              input(v-model='root.child_birth2', type='text', placeholder='最小孩子的出生年次(西元)')
              br
            span(v-show='root.child_birth2') 大約{{toAge(root.child_birth2)}}歲~{{toAge(root.child_birth)}}歲 
          .ui.divider
          .three.fields
            .field
              label.required 個人興趣
              input(v-model='root.learner_habit', placeholder='個人興趣')
            .field
              label.required 可分享
              input(v-model='root.share', placeholder='知識、服務、場地設備或物資')
            .field
              label 尋找
              input(v-model='root.ask', placeholder='讓人知道可以協助你什麼?')
            .field
              label 可支付
              input(v-model='root.price', placeholder='你願意支付多少錢或換工來得到協助?')
          .field
            label.required 自我介紹
            textarea#note(v-model='root.note', rows='5', cols='30', placeholder='自我介紹很重要，請寫20字以上，謝謝')
          .ui.warning.message(v-show="root.note && root.note.length < 20")
            .header 請再寫{{20 - root.note.length}}字介紹您自己
            p 愈詳細別人愈能認識您，您的旗幟才好發揮作用。        
          .ui.success.message(v-show="root.note && root.note.length >= 20")
            .header 謝謝您
            p 您詳細的介紹，讓人能夠更認識您。

        .warning(v-show="!isValid(root)")
          | note: 您還有
          i.red.star
          | 必填項目尚未填寫
      .ui.divider
      a.ui.large.blue.button(v-bind:class="{disabled: !isValid(root)}" @click="updateFlag")
        span(v-show='!this.users[this.uid]') 升起旗幟!!
        span(v-show='this.users[this.uid]') 更新旗幟!!
      br
      br
      br
      br
      br
</template>

<script>

import mix from '../mixins/mix.js'
import Loader from './Loader'
import { db } from '../firebase'
import { set, ref } from 'firebase/database'

export default {
  name: 'myflag',
  mixins: [mix],
  props: ['uid', 'user', 'email', 'mySearch', 'provider', 'photoURL', 'users', 'isInApp'],
  components: { Loader },
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '我的旗幟',
  },
  data () {
    return {
      myIndex: -1,
      root: {},
      local: {}
    }
  },
  // firebase: {
  //  users: usersRef
  // },
  methods: {
    setMe () {
      console.log(this.users)
      const keys = Object.keys(this.users)
      this.root = this.users[this.uid] || {}
      this.root.email = this.email
      console.log(this.root.email)
      this.myIndex = keys.indexOf(this.uid)
      if (this.uid && this.myIndex === -1) {
        console.log('new')
        this.myIndex = this.uid
        this.root = {
          name: this.user.providerData[0].displayName || '新朋友',
          uid: this.uid,
          email: this.email,
          photoURL: this.photoURL || '',
          note: ''
        }
      }
      console.log(this.root.name)
      console.log(this.root)
      this.$forceUpdate()
    },
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
      const vm = this
      console.log(this.users)
      const keys = Object.keys(this.users)
      const usersList = keys.map(function (k) {
        return vm.users[k]
      })
      var ans, i$, ref$, len$, h
      ans = false
      for (i$ = 0, len$ = (ref$ = usersList.filter(fn$)).length; i$ < len$; ++i$) {
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
      if (this.myIndex > -1) {
        set(ref(db, 'users/' + this.uid), this.root).then(
          alert('更新成功!')
        )
      } else {
        console.log('new2')
        set(ref(db, 'users/' + this.uid), this.root).then(
          alert('登錄成功!')
        )
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
