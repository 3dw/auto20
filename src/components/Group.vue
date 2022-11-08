<template lang="pug">
  .hello
    .ui.container(v-if="groups[0]")
      .ui.grid
        .row
          .ui.list
            .item
              h3 〈{{g.n}}〉
              p {{g.intro}}
                br.thin-only
                | &nbsp;&nbsp;&nbsp;&nbsp;
                a(@click="edit = !edit")
                  i.edit.icon
                  | {{edit ? '結束' : ''}}編輯社團資料
              .ui.form(v-show="edit")
                .field(v-if="!uid")
                  button.ui.orange.button(@click="loginGoogle()")
                    i.google.icon
                    | 請先登入
                .field
                  .ui.labeled.input
                    label.ui.label 輸入社團簡介  
                    input(type="text", v-model="newIntro", placeholder="請先輸入社團簡介")
                .field
                  a.ui.green.button(:class="{disabled: !newIntro}", @click="addIntro()")
                    | 更新簡介
              .ui.grid
                .row
                  .div.pad 成員：
                    span(v-for="m in g.members")
                      router-link(:to = "'/flag/' + m")
                        img.ui.avatar(:src="users[m].photoURL", alt="users[m].n")
                    span(v-show="uid")
                      a.ui.green.button(v-show="!isMember()", @click="join()") 加入
                      a.ui.red.button(v-show="!isMember()", @click="out()") 退出
                .two.column.stackable.row
                  .column
                    .ui.divided.list
                      .item(v-for = "(r, index) in g.res", :key="index + r.n + r.href")
                        a(:href="r.href", target="_blank", rel="noopener noreferrer")
                          img(:src="'http://www.google.com/s2/favicons?domain=' + r.href", alt="r.n")
                          | {{r.n}}
                      .item.ui.form(v-show="uid && edit")
                        .field
                          .ui.labeled.input
                            label.ui.label 輸入資源名
                            input(type="text", v-model="newResName", placeholder="請先輸入資源名")
                        .field
                          .ui.labeled.input
                            label.ui.label 輸入資源網址
                            input(type="text", v-model="newHref", placeholder="請先輸入資源網址")
                        .field
                          a.ui.green.button(:class="{disabled: !newHref || !newResName}",@click="addRes()")
                            | 新增資源
                  .column
                    .ui.divided.list
                      .item(v-for = "(c, index) in g.chats", :key="index")
                        | {{c.n}} : {{c.t}}
                      .item.ui.form(v-show="uid && edit")
                        .field
                          img.ui.avatar(:src="photoURL")
                          .ui.labeled.input
                            input.input(v-model="msg" placeholder="在想什麼嗎?")
                            a.ui.label.green.button(:class="{disabled: !msg}", @click="addChat(idx)") 留言
        .row
          .column.ui.buttons
            router-link.ui.green.button(to="/groups")
              i.globe.icon
              | 查看所有社團
            ShareNetwork.ui.blue.button(v-if="g.n", network="facebook", :url="'https://we.alearn.org.tw/#/group/' + $route.params.idx", :title="g.n", :description="g.n + ': ' + g.intro", :quote="g.n + ': ' + g.intro")
              i.facebook.icon
              | 臉書分享
        
</template>

<script>

import { set, ref } from 'firebase/database'
import { db } from '../firebase'

export default {
  name: 'group',
  props: ['photoURL', 'users', 'user', 'uid', 'mySearch', 'groups'],
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: '自學社團',
  },
  data () {
    return {
      edit: false,
      newIntro: '',
      newName: '',
      newResName: '',
      newHref: '',
      msg: '',
      g: {}
    }
  },
  methods: {
    loginGoogle: function () {
      this.$emit('loginGoogle')
    },
    isMember () {
      // console.log(this.groups)
      // console.log(this.$route.params.idx)
      // console.log(this.groups[this.$route.params.idx])
      return (this.groups[this.$route.params.idx].members || []).indexOf(this.uid) > -1
    },
    join () {
      this.groups[this.$route.params.idx].members = this.groups[this.$route.params.idx].members || []
      this.groups[this.$route.params.idx].members.push(this.uid)
      set(ref(db, 'groups'), this.groups).then(
        console.log('groups更新成功')
      )
    },
    out () {
      const vm = this
      this.groups[this.$route.params.idx].members = this.groups[this.$route.params.idx].members || []
      this.groups[this.$route.params.idx].members = this.groups[this.$route.params.idx].members.filter(function (i) {
        return i !== vm.uid
      })
      set(ref(db, 'groups'), this.groups).then(
        console.log('groups更新成功')
      )
    },
    addChat () {
      var o = {
        uid: this.uid,
        n: (this.user.providerData || [ {displayName: '匿名'} ])[0].displayName,
        t: this.msg,
        photoURL: this.photoURL || '',
        time: (new Date()).getTime()
      }
      this.g.chats = 
        this.g.chats || []
      if (this.msg) {
        this.g.chats.push(o)
        this.msg = ''
      }
      set(ref(db, 'groups/' + this.$route.params.idx), this.g).then(
        console.log('groups更新成功')
      )
    },
    addGroup () {
      this.g.push(
        { n: this.newName,
          res: [],
          chats: [],
          members: [this.uid]
        }
      )
      this.newName = ''
      set(ref(db, 'groups/' + this.$route.params.idx), this.g).then(
        console.log('groups更新成功')
      )
    },
    addRes () {
      this.g.res = 
        this.g.res || []
      this.g.res.push(
        { n: this.newResName, href: this.newHref })
      this.newResName = ''
      this.newHref = ''
      set(ref(db, 'groups/' + this.$route.params.idx), this.g).then(
        console.log('groups更新成功')
      )
    },
    addIntro () {
      this.groups[this.$route.params.idx].intro = this.newIntro
      this.newIntro = ''
      set(ref(db, 'groups'), this.groups).then(
        console.log('groups更新成功')
      )
      // console.log(this.groups)
    }
  },
  watch: {
    groups (newGs) {
      this.g = newGs[this.$route.params.idx]
    }
  },
  mounted () {
    this.g = this.groups[this.$route.params.idx] || {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.ui.list {
  width: 100%;
}

.pad {
  padding-left: 3em;
}

</style>
