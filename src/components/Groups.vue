<template lang="pug">
  .hello
    .ui.container
      .ui.grid
        .row.ui.form
          .field
            .ui.labeled.input
              label.ui.label 輸入名字
              input(type="text", v-model="newName")
          .field
            a.ui.green.button(@click="addGroup()")
              | 創建社團
        .row
          .ui.list
            .item(v-for = "(g, idx) in groups", :key="idx")
              h3 {{g.n}}
              .ui.grid
                .two.column.stackable.row
                  .column
                    .ui.divided.list
                      .item(v-for = "(r, index) in g.res", :key="index + r.n + r.href")
                        a(:href="r.href", target="_blank", rel="noopener noreferrer") {{r.n}}
                      .item.ui.form
                        .field
                          .ui.labeled.input
                            label.ui.label 輸入資源名
                            input(type="text", v-model="newResName", placeholder="資源名")
                        .field
                          .ui.labeled.input
                            label.ui.label 輸入資源網址
                            input(type="text", v-model="newHref", placeholder="網址")
                        .field
                          a.ui.green.button(@click="addRes(idx)")
                            | 新增資源
                  .column
                    .ui.divided.list
                      .item(v-for = "(c, index) in g.chats", :key="index")
                        | {{c.n}} : {{c.t}}
                      .item.ui.form
                        .field
                          img.ui.avatar(:src="photoURL")
                          .ui.labeled.input
                            input.input(v-model="msg" placeholder="在想什麼嗎?")
                            a.ui.label.green.button(@click="addChat(idx)") 留言
        .row
          .column
            iframe(width="100%" height="600" src="https://docs.google.com/spreadsheets/d/1BbdFTBmHNehZIRoqpzaFmd1E5HE2qTdvnaQUWnB5m50/edit?usp=sharing")
        .row
          .column
            iframe(width="100%" height="600" src="https://docs.google.com/forms/d/e/1FAIpQLSdWQf1xFlugOLL1cQwlMc-od06wHSTLLwlpjYTqli5bHAHgcw/viewform")
        
</template>

<script>

import { onValue, set, ref } from 'firebase/database'
import { db, groupsRef } from '../firebase'

export default {
  name: 'groups',
  props: ['photoURL', 'user'],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '自學社團',
  },
  data () {
    return {
      newName: '',
      newResName: '',
      newHref: '',
      msg: '',
      groups: []
    }
  },
  methods: {
    addChat (idx) {
      var o = {
        uid: this.uid,
        n: (this.user.providerData || [ {displayName: '匿名'} ])[0].displayName,
        t: this.msg,
        photoURL: this.photoURL || '',
        time: (new Date()).getTime()
      }
      if (this.msg) {
        this.groups[idx].chats.push(o)
        this.msg = ''
      }
    },
    addGroup () {
      this.groups.push(
        { n: this.newName,
          res: [],
          chats: []
        }
      )
      this.newName = ''
      set(ref(db, 'gorups'), this.groups).then(
        console.log('groups更新成功')
      )
    },
    addRes (idx) {
      this.groups[idx].res.push(
        { n: this.newResName, href: this.newHref })
      this.newResName = ''
      this.newHref = ''
      set(ref(db, 'gorups'), this.groups).then(
        console.log('groups更新成功')
      )
      console.log(this.groups)
    }
  },
  mounted () {
    onValue(groupsRef, (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      vm.groups = data
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.ui.list {
  width: 100%;
}

</style>
