<template lang="pug">
  .hello
    .ui.container
      .ui.grid
        .row
          .column
            iframe(width="100%" height="600" src="https://docs.google.com/spreadsheets/d/1BbdFTBmHNehZIRoqpzaFmd1E5HE2qTdvnaQUWnB5m50/edit?usp=sharing")
        .row
          .column
            iframe(width="100%" height="600" src="https://docs.google.com/forms/d/e/1FAIpQLSdWQf1xFlugOLL1cQwlMc-od06wHSTLLwlpjYTqli5bHAHgcw/viewform")
        
</template>

<script>

export default {
  name: 'groups',
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

iframe {
  overflow: scroll;
}

</style>
