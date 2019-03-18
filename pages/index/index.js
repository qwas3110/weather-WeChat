Page({

	data:{
		string: 'Hello world',
		temp: '12°',
		weather: '晴天'
	},

	onLoad() {
		wx.request({
			url: 'https://test-miniprogram.com/api/weather/now',
			data: {
				city: '广州'
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			// 调取成功后使用的方法
			success(res) {
				console.log(res.data)
				const result = res.data.result;
				const temp = result.now.temp + "°";
				const weather= result.now.weather;
				console.log(temp,weather);
				
			}
		})
	}
})