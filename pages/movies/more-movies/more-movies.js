var util = require("../../../util/util.js");
var app = getApp();
Page({
  data: {
    movies:{},
    navigateTitle: ""
  },
  onLoad: function(options) {
    var category = options.category;
    this.setData({
      navigateTitle: category
    });
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.g_doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.g_doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.g_doubanBase + "/v2/movie/top250";
        break;
    }
    util.http(dataUrl, this.processDouBanData);
  },
  processDouBanData:function(data){
    var movies = [];
    for (let idx in data.subjects) {
      var subject = data.subjects[idx];
      var title = subject.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + "...";
      }

      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    this.setData({ movies: movies});
  },
  onReady: function(event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success: function(res) {

      }
    })
  }
})