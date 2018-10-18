var util = require("../../../util/util.js");
var app = getApp();
Page({
  data: {
    movies: {},
    navigateTitle: "",
    totalCount: 0,
    redirectUrl: "",
    isEmpty: true
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
    this.setData({
      redirectUrl: dataUrl
    });
    util.http(dataUrl, this.processDouBanData);
  },
  onPullDownRefresh: function(event) {
    var refreshUrl = this.data.redirectUrl + "?start=0&count=20";
    this.setData({
      isEmpty: true,
      movies: [],
      totalCount: 0
    });
    util.http(refreshUrl, this.processDouBanData);
    wx.showNavigationBarLoading();
  },
  onScrollLower: function(event) {
    var nextUrl = this.data.redirectUrl +
      "?start=" + this.data.totalCount +
      "&count=20";
    util.http(nextUrl, this.processDouBanData);
    wx.showNavigationBarLoading();
  },
  processDouBanData: function(data) {
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
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
      this.setData({
        isEmpty: false
      });
    }
    var totalCount = this.data.totalCount + 20;
    this.setData({
      movies: totalMovies,
      totalCount: totalCount
    });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReady: function(event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success: function(res) {

      }
    })
  }
})