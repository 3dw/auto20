<template lang="jade">
  .hello
    .ui.segment.container
      .ui.fluid.card(v-for="(h, index) in hands" v-if="h.id == $route.params.id")
        card(:h="h", :full="true", :book="book", :mySearch="mySearch", @locate="locate")

      iframe(:src="'https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fwe.alearn.org.tw%2F%23%2Fflag%2F' + $route.params.id + '&layout=button_count&size=small&mobile_iframe=true&appId=485195848253155&width=63&height=20'" width="104" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media")
</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Card from './Card'

export default {
  name: 'flag',
  components: { Card },
  mixins: [mix],
  props: ['mySearch', 'book'],
  data () {
    return {
    }
  },
  firebase: {
    hands: handsRef
  },
  methods: {
    locate: function (h) {
      this.$emit('locate', h)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #35495E;
}

.card {
  min-height: 80vh;
}

</style>
