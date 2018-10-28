<template lang="jade">
  .chats(v-bind:class = "{ full : isFull, mini: isMini }")
    #menu.ui.menu
      .right.menu
        a.item(v-if="!isFull" @click="isFull = true; isMini = false")
          i.comments.icon
          | 聊聊
        a.item(v-if="!isMini" @click="isFull = false; isMini = true")
          i.compress.icon
          | 縮小
    #box
      .ui.list(v-if = "chats.length")
        .item(v-for="c in chats")
          router-link(:to="'/flag/'+c.id")
            img.ui.avatar(:src="'http://graph.facebook.com/' + c.id + '/picture'", alt="^_^")
          span {{c.n}} : {{c.t}}
          span.gray(v-show="isFull") &nbsp;&nbsp;-{{ countDateDiff(c.time) }}
        .item
          .ui.form
            .field
              img.ui.avatar(:src="'http://graph.facebook.com/' + id + '/picture'")
              input#input(v-model="msg" placeholder="在想什麼嗎?" autofocus)
              a.ui.green.small.button(@click="addChat") 留言
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
      isMini: true
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
  .chats {
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

  .chats.full {
    width: 100vw;
    height: 66vh;    
  }

  .chats.mini {
    width: 50vh;
    height: 200px;    
  }

  img.ui.avatar {
    float: left;
  }

  #input {
    width: 60% !important;
    vertical-align: bottom !important;
  }

  @media screen and (max-width: 600px) {
    .chats {
      width: 100vw;
      height: 20vh;
    }

    .chats.full {
      width: 100vw;
      height: 80vh;    
    }

    .chats.mini {
      width: 100vw;
      height: 0;    
    }

    #input {
      width: 150px !important;
      vertical-align: bottom !important;
    }
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
</style>
