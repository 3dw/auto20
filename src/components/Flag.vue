<template lang="jade">
  .hello
    .ui.centered.card(v-for="(h, index) in hands" v-if="index == $route.params.id")
      h4.ui.header 
        img.main(src='../assets/handshake0.png', :src='getIcon(h)' alt='^_^')
        | {{h.name}}
      .ui.container
        br    
        h1.ui.header
        a(:href='h.site', target='_blank')
          | 個人網址：
          img.icon(:src="'http://www.google.com/s2/favicons?domain=' + h.site", title='site', alt='site')
        
        a(v-show='h.site2', :href='h.site2', target='_blank')
          | 社群網址：
          img.icon(:src="'http://www.google.com/s2/favicons?domain=' + h.site2", title='community', alt='community')
        .ui.divider
        sub#time
          | {{ countDateDiff(h.lastUpdate) }}已更新
        .ui.divider
        #intro
          .ui.list          
            .item#childern(v-show='h.learner_birth || h.child_birth')
              | 約
              span(v-html='toAge(h.learner_birth)')
              | 歲的
              span(v-html='h.learner_role || "人"')
              span(v-show='h.child_birth')
                | (孩子約
                span(v-show='h.child_birth2', v-html="toAge(h.child_birth2) +' ~'")
                span(v-html='toAge(h.child_birth)')
                | 歲)
            .item#address(v-show='h.address')
              | 位於：
              a(:href="'https://www.google.com.tw/maps/search/'+h.address", target='blank', v-html='highlight(h.address, mySearch)')
            .item#freetime(v-html="highlight('最近有空：' + h.freetime || lorem, mySearch)")
            .ui.divider
            .item#like(v-html="highlight('興趣：'+h.learner_habit || lorem, mySearch)")
            .item#share(v-html="highlight('分享：'+h.share || lorem, mySearch)")
            .item#need(v-show="h.ask && h.ask.indexOf('無') == -1", v-html="highlight('尋找：' + h.ask || lorem, mySearch)")
          p(v-show='h.connect_me' v-html="highlight('聯絡方式：'+h.connect_me, mySearch)")
          .ui.divider


</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'

export default {
  name: 'hello',
  mixins: [mix],
  data () {
    return {
      mySearch: ''
    }
  },
  firebase: {
    hands: handsRef
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
