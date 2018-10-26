<template lang="jade">
  .hello
    .ui.list(v-if = "chats.length")
      .item(v-for="c in chats")
        img.ui.avatar(:src="'http://graph.facebook.com/' + c.id + '/picture'")
        span {{c.n}} : {{c.t}}
      .item
        .ui.form
          .field
            img.ui.avatar(:src="'http://graph.facebook.com/' + id + '/picture'")
            input(v-model="msg" placeholder="在想什麼嗎?" autofocus @keydown.enter="addChat")
            // a.ui.green.button(@click="addChat") 留言
</template>

<script>

import { chatsRef } from '../firebase'
import mix from '../mixins/mix.js'

export default {
  name: 'chats',
  mixins: [mix],
  props: ['id', 'user'],
  data () {
    return {
      msg: ''
    }
  },
  firebase: {
    chats: chatsRef
  },
  methods: {
    addChat: function () {
      var o = {
        id: this.id,
        n: this.user.providerData[0].displayName,
        t: this.msg
      }
      this.$firebaseRefs.chats.push(o)
      this.msg = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    position: fixed;
    z-index: 999999;
    bottom: 0;
    right: 0;
    width: 33vw;
    height: 25vh;
    overflow: scroll;
    border: 1px solid black;
    background-color: white;
  }
</style>
