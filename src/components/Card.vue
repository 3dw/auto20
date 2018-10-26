<template lang="jade">
  router-link(:to="'/flag/'+h.id")
    .image
      h4.ui.header
        img.main(src='../assets/handshake0.png', :src='getIcon(h)' alt='^_^')
        | {{h.name}}
        span(v-if="h.learner_birth")
          span(v-html='toAge(h.learner_birth)')
          | 歲
        span(v-if = "h.child_birth") (孩子 {{toAge(h.child_birth)}}
          span(v-if="h.child_birth2")
            | ~ {{toAge(h.child_birth2)}}
          | 歲)
    .content
      p.description 位於 {{h.address}} 附近
      p.description(v-if="h.share") 可分享： {{h.share}}
      p.description(v-if="h.ask") 需要： {{h.ask}}
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

</style>
