<template lang="jade">
  .hello.ui.container
    .ui.fluid.card(v-for="(h, index) in hands" v-if="h.id == $route.params.id")
      card(:h="h", :full="true")
</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'
import Card from './Card'

export default {
  name: 'flag',
  components: { Card },
  mixins: [mix],
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

</style>
