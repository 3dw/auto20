<template lang="pug">
  .hello
    .ui.segmant.container
      img.small(src="../assets/work.png")
      h1 抱歉，自2022.10.27起，自學2.0進行大規摹改版維修，造成不便，敬請見諒!
      h3 任何疑問或意見，請
        a(href="mailto:bestian@gmail.com") email管理員

</template>

<script>

import mix from '../mixins/mix.js'

export default {
  name: 'hello',
  props: ['uid', 'user', 'zoom', 'center', 'mySearch', 'photoURL', 'book', 'cities'],
  mixins: [mix],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '歡迎',
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.small {
  width: 30%;
}

</style>
