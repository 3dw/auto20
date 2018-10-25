<template>
  <div class="hello">
    <img v-show="profile.name" :src="profilePicture" alt="profile" class="profile-picture"/>
    <h1 v-html="msg"></h1>
  </div>

</template>

<script>

import { handsRef } from '../firebase'
import mix from '../mixins/mix.js'

export default {
  name: 'hello',
  props: ['profile'],
  mixins: [mix],
  data () {
    return {
      msg: 'Welcome'
    }
  },
  computed: {
    msg () {
      if (this.profile.name) {
        return `Welcome <b><i> ${this.profile.name} </i></b> to Vue.js App`
      } else {
        return 'Login Facebook to Enjoy the App'
      }
    },
    profilePicture () {
      return (this.profile.id) ? `https://graph.facebook.com/${this.profile.id}/picture?width=300` : `/static/man.gif`
    }
  },
  firebase: {
    hands: handsRef
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
