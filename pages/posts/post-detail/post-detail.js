var util = require("../../../util/util.js");
var postsData = require("../../../data/post-data.js");

var app = getApp();
Page({
	data: {
		isPlayMusic: false
	},
	onLoad: function(options) {
		//初始化detail页面信息
		var postId = options.postId;
		this.setData({
			currentPostId: postId
		});
		var postData = postsData.postList[postId];
		util.convertEnpty(postData, () => {
			this.setData({
				data: postData
			});
		});

		//获取缓存信息
		var postsCollected = wx.getStorageSync("posts_collected");
		util.convertEnpty(postsCollected, () => {
			var postCollected = postsCollected[postId];
			util.convertEnpty(postCollected, () => {
				this.setData({
					collected: postCollected
				});
			});
		}, () => {
			var postsCollected = {};
			postsCollected[postId] = false;
			wx.setStorageSync("posts_collected", postsCollected);
		});
		if (app.globalData.g_isPlayMusic && app.globalData.g_currentMusicPostId === postId) {
			this.setData({
				isPlayMusic: true
			});
		}
		//监听音乐事件
		this.setMusicMonitor();
	},
	setMusicMonitor: function() {
		//监听音乐播放事件
		wx.onBackgroundAudioPlay(() => {
			app.globalData.g_currentMusicPostId = this.data.currentPostId;
			app.globalData.g_isPlayMusic = true;
			this.setData({
				isPlayMusic: app.globalData.g_isPlayMusic
			});
		});

		//监听音乐暂停事件
		wx.onBackgroundAudioPause(() => {
			app.globalData.g_currentMusicPostId = null;
			app.globalData.g_isPlayMusic = false;
			this.setData({
				isPlayMusic: app.globalData.g_isPlayMusic
			});
		});
	},
	onCollectionTap: function(event) {
		this.getPostsCollectedSync();
		// this.getPostsCollectedAsy();
	},
	getPostsCollectedAsy: function() {
		var that = this;
		wx.getStorage({
			key: "posts_collected",
			success: function(res) {
				var postsCollected = res.data;
				var postCollected = postsCollected[that.data.currentPostId];
				// 收藏变成未收藏，未收藏变成收藏
				postCollected = !postCollected;
				postsCollected[that.data.currentPostId] = postCollected;
				that.showToast(postsCollected, postCollected);
			}
		})
	},
	getPostsCollectedSync: function() {
		var postsCollected = wx.getStorageSync("posts_collected");
		var postCollected = !postsCollected[this.data.currentPostId];
		postsCollected[this.data.currentPostId] = postCollected;

		this.showToast(postsCollected, postCollected, () => {
			//更新文章是否收藏缓存值
			wx.setStorageSync("posts_collected", postsCollected);
			//更新绑定数据变量，实现图片切换
			this.setData({
				collected: postCollected
			});
		});
	},
	showToast: function(postsCollected, postCollected, callback) {
		callback && callback();
		wx.showToast({
			title: postCollected ? '收藏成功' : '取消成功',
			duration: 1000,
			icon: 'success'
		});
	},
	showModal: function(postsCollected, postCollected, callback) {
		wx.showModal({
			title: '收藏',
			content: postCollected ? '是否收藏该文章？' : '是否取消收藏该文章？',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#333',
			confirmText: '确定',
			confirmColor: '#405f80',
			success: (res) => {
				if (res.confirm) {
					callback && callback();
				}
			}
		});
	},
	onShareTap: function(event) {
		var itemList = [
			"分享给微信好友",
			"分享到朋友圈",
			"分享到QQ",
			"分享到微博"
		];
		wx.showActionSheet({
			itemList: itemList,
			itemColor: '#405f80',
			success: function(res) {
				wx.showModal({
					title: "用户 " + itemList[res.tapIndex],
					content: "用户是否取消？" + res.errMsg + "现在无法实现分享功能，什么时候能支持呢"
				})
			}
		})
	},
	onMusicTap: function(event) {
		var postData = postsData.postList[this.data.currentPostId];
		util.convertEnpty(postData, () => {
			var isPlayMusic = this.data.isPlayMusic;
			if (isPlayMusic) {
				wx.pauseBackgroundAudio();
				isPlayMusic = false;
			} else {
				wx.playBackgroundAudio({
					dataUrl: postData.music.url,
					title: postData.music.title,
					coverImgUrl: postData.music.coverImg
				});
				isPlayMusic = true;
			}
			app.globalData.g_isPlayMusic = isPlayMusic;
		});
	}
})
