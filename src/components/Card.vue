<template lang="jade">
  router-link(:to="'/flag/'+h.id")
    .image
      h4.ui.header
        img.main(src='../assets/handshake0.png', :src='getIcon(h)' alt='^_^')
        | {{h.name}}
        span(v-if="h.learner_birth")
          | -
          span(v-html='toAge(h.learner_birth)')
          | 歲
        span(v-if="h.child_birth") (孩子
        span(v-if="h.child_birth2") {{toAge(h.child_birth2)}} ~
        span(v-if="h.child_birth") {{toAge(h.child_birth)}} 歲)
    .content
      p.description.gray {{h.address}} - {{countDateDiff(h.lastUpdate)}}已更新
      p.description(v-if="h.learner_habit && full") 興趣： {{h.learner_habit}}
      p.description(v-if="h.share") 可分享： {{h.share}}
      p.description(v-if="h.ask") 需要： {{h.ask}}
    .content(v-if="h.connect_me")
      .ui.divider
      p.descrtpion 連絡方式： {{h.connect_me}}
    .content
      .ui.divider
      p.descrtpion(v-if="!full") {{part(h.note)}}...
      p.descrtpion(v-else) {{h.note}}
</template>

<script>

import mix from '../mixins/mix.js'

export default {
  name: 'hello',
  mixins: [mix],
  props: ['h', 'mySearch', 'full'],
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.image {
  background-color: #c9c9c9;
}

.gary {
  color: gray;
}

p {
  white-space: pre-line;
}

</style>
