<template lang="jade">
  .hello
    .ui.centered.card(v-if="id")
      a.ui.massive.green.button(@click="updateFlag") 更新旗幟
      h4.ui.header 
        img.main(src='../assets/handshake0.png', :src='getIcon(h)' alt='^_^')
        input(v-model="myHand.name")
      .ui.container
        br    
        h1.ui.header
        a(:href='myHand.site', target='_blank')
          | 個人網址：
          img.icon(:src="'http://www.google.com/s2/favicons?domain=' + myHand.site", title='site', alt='site')
        input(v-model="myHand.site")
        br  
        a(v-show='myHand.site2', :href='myHand.site2', target='_blank')
          | 社群網址：
          img.icon(:src="'http://www.google.com/s2/favicons?domain=' + myHand.site2", title='community', alt='community')
        input(v-model="myHand.site2")
        .ui.dividerh
        sub#time
          | {{ countDateDiff(myHand.lastUpdate) }}已更新
        .ui.divider
        #intro
          .ui.list          
            .item#childern(v-show='myHand.learner_birth || myHand.child_birth')
              | 約
              span(v-html='toAge(myHand.learner_birth)')
              | 歲的
              span(v-html='myHand.learner_role || "人"')
              span(v-show='myHand.child_birth')
                | (孩子約
                span(v-show='myHand.child_birth2', v-html="toAge(myHand.child_birth2) +' ~'")
                span(v-html='toAge(myHand.child_birth)')
                | 歲)
            .item#address(v-show='myHand.address')
              | 位於：
              a(:href="'https://www.google.com.tw/maps/search/'+myHand.address", target='blank', v-html='highlight(myHand.address, mySearch)')
            .item#freetime(v-html="highlight('最近有空：' + myHand.freetime || lorem, mySearch)")
            .ui.divider
            .item#like(v-html="highlight('興趣：'+myHand.learner_habit || lorem, mySearch)")
            .item#share(v-html="highlight('分享：'+myHand.share || lorem, mySearch)")
            .item#need(v-show="myHand.ask && myHand.ask.indexOf('無') == -1", v-html="highlight('尋找：' + myHand.ask || lorem, mySearch)")
          p(v-show='myHand.connect_me' v-html="highlight('聯絡方式：'+myHand.connect_me, mySearch)")
          .ui.divider


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
      myHand: {}
    }
  },
  firebase: {
    hands: handsRef
  },
  methods: {
    updateFlag: function () {
      this.myHand.lastUpdate = (new Date()).getTime()
      console.log(this.myHand)
      db.ref('hands/' + this.myIndex).update(JSON.parse(JSON.stringify(this.myHand).replace('.key', 'key').replace('undefined', 'null')))
      alert('更新成功!')
    }
  },
  created () {
    for (var i = 0; i < this.hands.length; i++) {
      if (this.hands[i].id === this.id) {
        this.myIndex = i
        this.myHand = this.hands[i]
      }
    }
    if (this.id && this.myIndex === -1) { this.myIndex = this.hands.length }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
