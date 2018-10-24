export default {
  methods: {
    toAge: function (y) {
      var ans = (new Date()).getFullYear()
      return ans - parseInt(y)
    },
    highlight: function (text, search) {
      var keys, i$, len$, k
      if (!text) {
        return ''
      }
      text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      text = text.replace(/&lt;\s*br\/?\s*&gt;/g, '<br/>')
      if (!search) {
        return text
      }
      if (search.substr(0, 1) === '$') {
        return text
      }
      keys = search.split(/\s+/g)
      for (i$ = 0, len$ = keys.length; i$ < len$; ++i$) {
        k = keys[i$]
        text = text.replace(new RegExp(k, 'gi'), '<span class="highlightedText">$&</span>')
      }
      return text
    },
    getIcon: function (h) {
      if (!h) {
        return ''
      }
      return 'http://graph.facebook.com/' + (h.fbid || h.id || h.username || h.username) + '/picture'
    }
  }
}
