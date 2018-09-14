var postsData = require("../../../data/post-data.js");
Page({
  onLoad: function(options) {
    var postId = options.postId;
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    });
    wx.setStorageSync("key", "data");
  },
  onCollectionTap:function(event){
    
  },
  onShareTap: function (event){

  }
})