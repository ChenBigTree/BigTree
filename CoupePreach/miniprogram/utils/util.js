function t(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}

module.exports = {
    formatTime: function(e) {
        var n = e.getFullYear(), o = e.getMonth() + 1, r = e.getDate(), u = e.getHours(), i = e.getMinutes(), g = e.getSeconds();
        return [ n, o, r ].map(t).join("/") + " " + [ u, i, g ].map(t).join(":");
    },
    buttonClicked: function(self) {
      self.setData({
        buttonClicked: true
      })
      setTimeout(function () {
        self.setData({
          buttonClicked: false
        })
      }, 500)
    }
};