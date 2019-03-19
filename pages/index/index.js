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

// 引入SDK核心类
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
// 创建文本变量
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

const UNPROMPTED_TIPS = "点击获取当前位置"
const UNAUTHORIZED_TIPS = "点击开启位置权限"
const AUTHORIZED_TIPS = ""

Page({

  data: {
    string: 'Hello world',
    nowTemp: '12°',
    nowWeather: '晴天',
    imgSrc: ``,
    hourlyWeather: [],
    todayTemp: '',
    todayDate: '',
    city: '厦门市',
    locationTipsText: UNPROMPTED_TIPS,
    locationAuthType: UNPROMPTED
  },
  onPullDownRefresh() {
    // 传入回调函数，当我自己刷新更新后，我就会停止
    this.getNow(() => {
      wx.stopPullDownRefresh()
    });
  },

  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: 'H2TBZ-7XC6P-765DS-VGG53-QDCGQ-WEFMX'
    });
    this.getNow();
  },

  //将调用数据单独写一个模块，方便调用刷新 
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      // 调取成功后使用的方法
      success: (res) => {
        console.log(res.data)
        // 获取数据
        let result = res.data.result
        // 调用
        this.setNow(result);
        this.setHourlyWeather(result);
        this.setToady(result);
      },
      // 当完成数据更新后，关闭下拉刷新，在complete完成函数内执行
      complete: () => {
        // 意思就是如果有回调函数传入，是true，我就执行下一条，就是去执行
        // 没传入就不执行
        callback && callback()
      }
    })
  },
  // 显示当前天气
  setNow(result) {
    const temp = result.now.temp + "°";
    const weather = result.now.weather;
    const imgSrc = `/img/${weather}-bg.png`;
    console.log(temp, weather, imgSrc);
    // 同步到视图 
    this.setData({
      nowTemp: temp,
      nowWeather: weatherMap[weather],
      imgSrc: imgSrc,
    });
    // 动态设置导航栏颜色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: weatherColorMap[weather]
    })
  },
  // 显示未来几个小时的天气
  setHourlyWeather(result) {
    // 设置时间 3个小时一次
    // 创建一个空数组
    let hourlyWeather = [];
    // 引用数据
    let forecast = result.forecast;
    // 引入时间
    let nowHour = new Date().getHours();
    // 循环，将数据修改，导入相应位置
    for (let x = 0; x < 8; x++) {
      hourlyWeather.push({
        time: `${(x * 3 + nowHour) % 24}时`,
        icon: `/img/${forecast[x].weather}-icon.png`,
        temp: `${forecast[x].temp}°`
      })
    };
    hourlyWeather[0].time = "当前";
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
  // 当天最高最低气温
  setToady(result) {
    let date = new Date();
    let today = result.today;
    this.setData({
      todayTemp: `${today.minTemp}° - ${today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 今天`
    })
  },
  // 点按事件
  onTapDayWeather() {
    console.log()
    wx.navigateTo({
      url: `/pages/list/list?city=${this.data.city}`
    })
  },

  // 获取经纬度
  onTapLocation() {
    this.getLocation();
  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          locationAuthType: AUTHORIZED,
          locationTipsText: AUTHORIZED_TIPS
        });
        console.log(res.longitude, res.latitude);
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: (res) => {
            console.log(res);
            const city = res.result.address_component.city;

            this.setData({
              city: city,
              locationTipsText: ''
            })
            this.getNow();
          }
        })
      },
      // 权限被拒绝后
      fail: () => {
        this.setData({
          locationAuthType: UNAUTHORIZED,
          locationTipsText: UNAUTHORIZED_TIPS
        })
      }
    })
  }
})