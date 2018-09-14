var postsData = require('../../data/post-data.js');
Page({
  onLoad: function (options) {
    this.setData({
      datas: postsData.postList
    });
  },
  onPostTap: function(event){
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?postId=' + postId
    })
  }
})