<template lang="pug">
  .hello
    router-link(:to="'/flag/'+h.uid")
      .image
        h4.ui.header
          img.main(:src='getIcon(h)' alt='^_^')
          | {{h.name}}
          span(v-if="h.learner_birth")
            | -
            span(v-html='toAge(h.learner_birth)')
            | 歲
          span(v-if="h.child_birth") (孩子
          span(v-if="h.child_birth2") {{toAge(h.child_birth2)}} ~
          span(v-if="h.child_birth") {{toAge(h.child_birth)}} 歲)
      .content
        p.description.gray 
          span(v-html="highlight(h.address, mySearch)")
          |&nbsp;&nbsp; - {{countDateDiff(h.lastUpdate)}}已更新
        p.description(v-if="h.learner_habit && full" v-html="'興趣： ' + highlight(h.learner_habit, mySearch)")
        p.description(v-if="h.share" v-html="'可分享： ' + highlight(h.share, mySearch)")
        p.description(v-if="h.ask" v-html="'需要： ' + highlight(h.ask, mySearch)")
      .content(v-if="h.connect_me && full")
        .ui.divider
        p.descrtpion 連絡方式： {{h.connect_me}}
        p.descrtpion(v-if="h.freetime") 有空時間： {{h.freetime}}
      .content
        .ui.divider
        p.descrtpion(v-if="!full")
          vue-simple-markdown.text(:source="highlight(part(h.note), mySearch) + '...'")
        p.descrtpion(v-else)
          vue-simple-markdown.text(:source="highlight(h.note, mySearch)")
    .filler
    .ui.bottom.attached.buttons
      .ui.green.basic.button(@click="addBook(h.uid || h.idx)" v-if="book.indexOf(h.uid || h.idx) == -1")
        i.book.icon
        | 加入名簿
      .ui.red.basic.button(@click="removeBook(book.indexOf(h.uid || h.idx))" v-else)
        i.book.icon
        | 從名簿移除
      .ui.pink.basic.button(@click="locate(h)")
        i.map.icon
        | 地圖檢視
</template>

<script>

import mix from '../mixins/mix.js'

export default {
  name: 'card',
  mixins: [mix],
  props: ['h', 'mySearch', 'full', 'uid', 'book'],
  data () {
    return {
    }
  },
  methods: {
    locate: function (h) {
      console.log(h)
      this.$emit('locate', h)
    },
    addBook: function (uid) {
      console.log(uid)
      this.$emit('addBook', uid)
    },
    removeBook: function (index) {
      console.log(index)
      this.$emit('removeBook', index)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.hello {
  position: relative;
  height: 100%;
  min-height: 300px;
}

.image {
  background-color: #c9c9c9;
}

.gray {
  color: gray;
}

p {
  white-space: pre-line;
}

.ui.bottom.attached.buttons {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100% !important;
}

.filler {
  height: 100px;
}

</style>
