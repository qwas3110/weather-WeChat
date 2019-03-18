const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

Page({
  data: {
    weekWeather: []
  },
	onPullDownRefresh() {
		this.getWeekWeather(() => {wx.stopPullDownRefresh()});
	},
	onLoad() {
		this.getWeekWeather();
	},
	getWeekWeather(callback) {
		wx.request({
			url: 'https://test-miniprogram.com/api/weather/future',
			data: {
				city: '广州市',
				time: new Date().getTime()
			},
			success: (res) => {
				console.log(res.data.result);
				const result = res.data.result;
				this.setWeekWeather(result);
			},
			complete: () => {
				callback && callback();
			}
		})
	},
	setWeekWeather(result) {
		let weekWeather = [];
		let date = new Date();

		for (let x = 0; x < result.length; x++) {
			weekWeather.push({
				day: `${dayMap[x]}`,
				date: `${date.getFullYear()}-${date.getMonth() +x}-${date.getDate()}`,
				imgSrc: `/img/${result[x].weather}-icon.png`,
				temp: `${result[x].minTemp}°-${result[x].maxTemp}°`
			})
		};
		weekWeather[0].day = '今天';
		this.setData({weekWeather})

	}



})