<template lang="jade">
  .hello
    .ui.segment.container
      .ui.fluid.card(v-for="(h, index) in hands" v-if="h.id == $route.params.id")
        card(:h="h", :full="true", :mySearch="mySearch")

      iframe(src="https://www.facebook.com/plugins/share_button.php?href=http%3A%2F%2Fwe.alearn.org.tw&layout=button_count&size=large&mobile_iframe=true&appId=485195848253155&width=104&height=28" width="104" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media")
</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Card from './Card'

export default {
  name: 'flag',
  components: { Card },
  mixins: [mix],
  props: ['mySearch'],
  data () {
    return {
    }
  },
  firebase: {
    hands: handsRef
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #35495E;
}

</style>
