// pages/pageQueryDetail/pageQueryDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex:0,
    recordOne:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var curIndex=options.curIndex;//这是调用方送来的值，送入当前页面data部分
    var recordOne=JSON.parse(options.recordOne);//将字符串转换为JSON格式
    console.log(curIndex);
    console.log(recordOne);
    this.setData({//可在界面中显示出来
      "curIndex":curIndex,
      "recordOne":recordOne
    });
  },
  returnParent:function(){
    wx.navigateBack({
    });
  },
})