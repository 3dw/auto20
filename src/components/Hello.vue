<template lang="jade">
  .hello
    h1 {{msg}} {{user.displayName}}
    a.ui.massive.blue.button(@click="login", v-if="!user")
      i.facebook.icon
      | 登入
    router-link.ui.massive.blue.button(to="/myFlag", v-else)
      img(:src = "'http://graph.facebook.com/' + id + '/picture'")
      | 我的旗幟

</template>

<script>

import mix from '../mixins/mix.js'

export default {
  name: 'hello',
  props: ['id', 'user'],
  mixins: [mix],
  data () {
    return {
      msg: '歡迎'
    }
  },
  methods: {
    login: function () {
      this.$emit('login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
