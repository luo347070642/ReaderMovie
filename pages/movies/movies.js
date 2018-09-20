var util = require("../../util/util.js");
var app = getApp();
Page({
	data: {
		inTheaters: "",
		comingSoon: "",
		top250: ""
	},
	onLoad: function(options) {
		var inTheatersUrl = app.globalData.g_doubanBase + "/v2/movie/in_theaters";
		var comingSoonUrl = app.globalData.g_doubanBase + "/v2/movie/coming_soon";
		var top250Url = app.globalData.g_doubanBase + "/v2/movie/top250";
		var paramData = {
			start: 0,
			count: 3
		};
		this.getMovieListData(inTheatersUrl, paramData, "inTheaters", "正在热映");
		this.getMovieListData(comingSoonUrl, paramData, "comingSoon", "即将上映");
		this.getMovieListData(top250Url, paramData, "top250", "豆瓣Top250");
	},

	getMovieListData: function(url, data, settedKey, categoryTitle) {
		wx.request({
			url: url,
			data: data,
			method: 'GET',
			header: {
				"Content-Type": "application/json"
			},
			success: (res) => {
				this.processDouBanData(res.data, settedKey, categoryTitle);
			},
			fail: function() {
				console.error("failed");
			}
		});
	},
	processDouBanData: function(moviesDouban, settedKey, categoryTitle) {
		var movies = [];
		for (let idx in moviesDouban.subjects) {
			var subject = moviesDouban.subjects[idx];
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
		var readyData = {};
		readyData[settedKey] = {
			categoryTitle: categoryTitle,
			movies: movies
		};
		this.setData(readyData);
	}
})
