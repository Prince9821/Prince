// pages/pageQuery/pageQuery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList:[],//所有记录
    curIndex:0,//当前行的下标号
    recordOne:null,//当前行对应的记录
    pagesize:'3',//每页10行
    pageindex:'2',//第几页
    cond:'-',//查询条件
    fieldlist:'-',//提取字段
    orderfield:'idint',//排序用字段
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: 'https://mobile.wuyou.com.cn/smartpark/testloginapi.asmx/getOnePage',
      method: 'POST',
      data:{
        cond:that.data.cond,
        fieldlist:that.data.fieldlist,
        orderfield:that.data.orderfield,
        pageindex:that.data.pageindex,
        pagesize:that.data.pagesize,
      },
      header: { 'content-type': 'application/json;charsset=utf-8' },
      success: function (res) {//读取数据成功
        console.log(res);
        var retData = JSON.parse(res.data.d);//转换为JSON格式
        console.log(retData);
        if (retData[0].code == 1) {//对于多条记录组成的数据，这里必须是引用数组的元素
          wx.showToast({
            title: '读数成功',
            icon: 'success',
            duration: 1000
          });
          that.setData({
            "recordList":retData,//将相关数据写到data部分中
          });
          console.log(that.data.recordList);
        }
      }
    });
  },
  //获取详情
  auditRow:function(e){
    var curIndex=e.target.dataset.editindex;//行号
    var recordOne=this.data.recordList[curIndex];//当前行数据
    this.setData({
      "curIndex":curIndex,
      "recordOne":recordOne,
    });
    wx.navigateTo({//将JSON转换为字符串
      url: '../pageQueryDetail/pageQueryDetail?curIndex='+curIndex+"&recordOne"+JSON.stringify(recordOne)
      //url: '../pageQueryDetail/pageQueryDetail?curIndex='+recordOne
    });
  },
})