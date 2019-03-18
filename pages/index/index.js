// 天气描述转中文
const weatherMap = {
	'sunny': '晴天',
	'cloudy': '多云',
	'overcast': '阴',
	'lightrain': '小雨',
	'heavyrain': '大雨',
	'snow': '雪'
};
//  将天气英文对应到相应的颜色，应用于动态修改导航栏颜色，匹配
const weatherColorMap = {
	'sunny': '#cbeefd',
	'cloudy': '#deeef6',
	'overcast': '#c6ced2',
	'lightrain': '#bdd5e1',
	'heavyrain': '#c5ccd0',
	'snow': '#aae1fc'
}


Page({

  data: {
    string: 'Hello world',
    nowTemp: '12°',
    nowWeather: '晴天',
		imgSrc:`/img/sunny-bg.png`
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
      success: (res) => {
        console.log(res.data)
        const result = res.data.result;
        const temp = result.now.temp + "°";
        const weather = result.now.weather;
				const imgSrc = `/img/${weather}-bg.png`;
				
        console.log(temp, weather,imgSrc);
				this.setData({
					nowTemp:temp,
					nowWeather:weatherMap[weather],
					imgSrc:imgSrc
				});
				// 动态设置导航栏颜色
				wx.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor:weatherColorMap[weather]
				})

      }
    })
  }
})