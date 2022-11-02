<template lang="pug">
  .hello
    .ui.segment.container
      h3 外部連結
      .ui.list
        .item(v-for = "l in links", :key="l.n")
          a(:href="l.h", target="_blank", rel="noopener noreferrer")
            img(:src="'http://www.google.com/s2/favicons?domain=' + l.h", :alt="l.n")
            | {{ l.n }}
        
</template>

<script>

export default {
  name: 'outer',
  props: [],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '外部連結',
  },
  data () {
    return {
      links: [
        { n: '自學地圖', h: 'https://map.alearn.org.tw' },
        { n: '自主學習促進會', h: 'https://www.alearn.org.tw' },
        { n: '自由數學', h: 'https://math.alearn.org.tw' },
        { n: '保障教育選擇權聯盟', h: 'https://www.homeschool.tw/'}
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.ui.list {
  width: 100%;
}

</style>
