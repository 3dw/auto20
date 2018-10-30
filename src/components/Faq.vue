<template lang="jade">
  .hello
    section
      h1.ui.center.aligned.header 自學FAQ

    .ui.segment.container(v-for="c in catagories")
      h1(v-bind:style="{'color': c.color}")
        i.circular.icon(v-bind:class="cataIcon(c.t)")
        | {{c.t}}

      .ui.list
        .item(v-for = "(f, index) in faqs" v-if = "f.c == c.t")
          h2
            a(v-bind:style="{'color': c.color}" @click = "show = !show") {{f.q}}
          .ui(v-show="show")
            p.description(v-for = "a in f.as") {{a}}
            span(v-for = "(e,index) in f.es" v-if = "f.es && f.es.length")
                .ui.divider
                | 參考:&nbsp;&nbsp;
                a(:href = "e.h" target="_blank")
                  i.globe.icon
                  | {{e.t}}
            .ui.divider

    .ui.segment.container
      h1
       a(href="http://map.alearn.org.tw/#/contact" target="_blank") 有其他問題嗎? 請聯絡諮詢專線

</template>

<script>
export default {
  name: 'faq',
  props: ['mySearch'],
  data () {
    return {
      myC: '',
      handbook: {},
      catagories: [],
      faqs: [],
      show: false
    }
  },
  methods: {
    makeBr: function (str) {
      str = str || ''
      return str.replace(/\s/g, '<br/>').replace(/&nbsp;/g, '<br/>') || ''
    },
    highlightAndMakeBr: function (text, search) {
      text = this.makeBr(text)
      if (!search) {
        return text
      }
      return text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>')
    },
    cataColor: function (n) {
      return (this.catagories.filter(
        function (o) { return o.t === n }
      )[0] || {}).color || '#999'
    },
    cataIcon: function (n) {
      return (this.catagories.filter(
        function (o) { return o.t === n }
      )[0] || {}).icon || 'user'
    }
  },
  mounted () {
    // GET /someUrl
    this.$http.get('http://map.alearn.org.tw/static/api/handbook-data.json').then(response => {
      this.handbook = response.body
      this.catagories = this.handbook.catagories
      this.faqs = this.handbook.faqs
      // success callback
    }, response => {
      // error callback
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #35495E;
}

</style>
