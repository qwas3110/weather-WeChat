const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

Page({
  data: {
    weekWeather: [],
		city: ''
  },
	onPullDownRefresh() {
		this.getWeekWeather(() => {wx.stopPullDownRefresh()});
	},
	onLoad(options) {
		const city = options.city;
		this.setData({city:city})
		console.log(city);
		this.getWeekWeather();
	},
	getWeekWeather(callback) {
		wx.request({
			url: 'https://test-miniprogram.com/api/weather/future',
			data: {
				city: this.data.city,
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
		

		for (let x = 0; x < result.length; x++) {
			let date = new Date();
			// 获取一个新的日期，加1，以此类推
			date.setDate(date.getDate() + x)
			weekWeather.push({
				day: `${dayMap[date.getDay()]}`,
				date: `${date.getFullYear()}-${date.getMonth() +x}-${date.getDate()}`,
				imgSrc: `/img/${result[x].weather}-icon.png`,
				temp: `${result[x].minTemp}°-${result[x].maxTemp}°`
			})
		};
		weekWeather[0].day = '今天';
		this.setData({weekWeather})

	}



})