<template lang="jade">
  .hello
    .ui.centered.card(v-if="id")
      a.ui.massive.green.button(@click="updateFlag") 更新旗幟
      h4.ui.header 
        img.main(src='../assets/handshake0.png', :src='getIcon(h)' alt='^_^')
        input(v-model="myHand.name")
      .ui.container
        form#main-form.ui.form.error.warning.success
          h2.ui.header 請填表
            .sub.header
              | 為了讓人真的能找到夥伴，有標記紅色星號
              i.red.star
              | 的欄位為必填
          h4.ui.dividing.header 關於我
          .field
            label.required 名字


</template>

<script>

import { handsRef, db } from '../firebase'
import mix from '../mixins/mix.js'

export default {
  name: 'hello',
  mixins: [mix],
  props: ['id'],
  data () {
    return {
      mySearch: '',
      myIndex: -1,
      myHand: {}
    }
  },
  firebase: {
    hands: handsRef
  },
  methods: {
    updateFlag: function () {
      this.myHand.lastUpdate = (new Date()).getTime()
      if (this.myIndex < this.hands.length) {
        db.ref('hands/' + this.myIndex).update(JSON.parse(JSON.stringify(this.myHand).replace('.key', 'key').replace('undefined', 'null')))
        alert('更新成功!')
      } else {
        db.ref('hands/' + this.myIndex).set(JSON.parse(JSON.stringify(this.myHand).replace('.key', 'key').replace('undefined', 'null')))
        alert('登錄成功!')
      }
    }
  },
  created () {
    for (var i = 0; i < this.hands.length; i++) {
      if (this.hands[i].id === this.id) {
        this.myIndex = i
        this.myHand = this.hands[i]
      }
    }
    if (this.id && this.myIndex === -1) { this.myIndex = this.hands.length }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

label.required::before {
  content: "*";
  color:red;
}

i.red.star::before{
  content: "*";
  color:red;    
}

</style>
