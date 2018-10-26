<template lang="jade">
  .hello(v-bind:class = "{ full : isFull, mini: isMini }")
    #menu.ui.menu
      .right.menu
        a.item(v-if="!isFull" @click="isFull = true; isMini = false")
          i.expand.icon
        a.item(v-if="!isMini" @click="isFull = false; isMini = true")
          i.compress.icon
    #box
      .ui.list(v-if = "chats.length")
        .item(v-for="c in chats")
          img.ui.avatar(:src="'http://graph.facebook.com/' + c.id + '/picture'")
          span {{c.n}} : {{c.t}}
          span.gray(v-show="isFull") &nbsp;&nbsp;-{{ countDateDiff(c.time) }}
        .item
          .ui.form
            .field
              img.ui.avatar(:src="'http://graph.facebook.com/' + id + '/picture'")
              input#input(v-model="msg" placeholder="在想什麼嗎?" autofocus)
              a.ui.green.button(@click="addChat") 留言
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
      msg: '',
      isFull: false,
      isMini: false
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
        t: this.msg,
        time: (new Date()).getTime()
      }
      if (this.msg) {
        this.$firebaseRefs.chats.push(o)
        this.msg = ''
      }
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
    height: 33vh;
    overflow: visible;
    border: 1px solid black;
    background-color: white;
  }

  .hello.full {
    width: 66vw;
    height: 66vh;    
  }

  .hello.mini {
    width: 33vh;
    height: 100px;    
  }

  .gray {
    color: gray;
  }

  #menu {
    position: absolute;
    top: -40px;
    left: 0;
    width: 100%;
  }

  #box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }

  .ui.list {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  #input {
    width: 60% !important;
    vertical-align: bottom !important;
  }
</style>
