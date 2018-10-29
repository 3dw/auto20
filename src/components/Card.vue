<template lang="jade">
  .hello
    router-link(:to="'/flag/'+h.id")
      .image
        h4.ui.header
          img.main(src='../assets/handshake0.png', :src='getIcon(h)' alt='^_^')
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
          | - {{countDateDiff(h.lastUpdate)}}已更新
        p.description(v-if="h.learner_habit && full" v-html="'興趣： ' + highlight(h.learner_habit, mySearch)")
        p.description(v-if="h.share" v-html="'可分享： ' + highlight(h.share, mySearch)")
        p.description(v-if="h.ask" v-html="'需要： ' + highlight(h.ask, mySearch)")
      .content(v-if="h.connect_me")
        .ui.divider
        p.descrtpion 連絡方式： {{h.connect_me}}
      .content
        .ui.divider
        p.descrtpion(v-if="!full" v-html="highlight(part(h.note), mySearch) + '...'")
        p.descrtpion(v-else v-html="highlight(h.note, mySearch)")
    .ui.bottom.attached.buttons
      .ui.green.basic.button(@click="addBook(h.id)" v-if="book.indexOf(h.id) == -1")
        i.book.icon
        | 加入名簿
      .ui.red.basic.button(@click="removeBook(book.indexOf(h.id))" v-else)
        i.book.icon
        | 移除
      .ui.pink.basic.button(@click="locate(h)")
        i.map.icon
        | 地圖檢視
</template>

<script>

import mix from '../mixins/mix.js'

export default {
  name: 'hello',
  mixins: [mix],
  props: ['h', 'mySearch', 'full', 'id', 'book'],
  data () {
    return {
    }
  },
  methods: {
    locate: function (h) {
      console.log(h)
      this.$emit('locate', h)
    },
    addBook: function (id) {
      console.log(id)
      this.$emit('addBook', id)
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

.image {
  background-color: #c9c9c9;
}

.gary {
  color: gray;
}

p {
  white-space: pre-line;
}

</style>
