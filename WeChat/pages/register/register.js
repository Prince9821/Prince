// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone:'',//手机号即账号
    userpw:'',//密码
    userpw2:'',//密码2
    role:[],//固定为1即车主，以后再通过页面输入
    userName:'',//姓名
    userwx:'努力前行的蜗牛',
  },
  //获取输入账号
  phoneInput:function(e){
    this.setData({
      userPhone:e.detail.value //不用''也是可以的
    })
  },
  //获取输入密码
  passwordInput:function(e){
    this.setData({
      userpw:e.detail.value
    })
  },
  passwordInput2: function (e) {
    this.setData({
      userpw2: e.detail.value
    })
  },
  //姓名
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  //角色
 roleInput: function (options) {
   //因为复选框组比较特殊，所以先显示一下
   console.log('checkbox发生change事件,携带value值为:',options.detail.value);
    this.setData({
      role: options.detail.value
    })
  },
  //注册 没有用到校验码，以后再解决
  register:function(){
    if(this.data.userPhone.length==0){
      wx.showToast({
        title: '手机号为空',
        icon:'success',
        duration:4000
      })
    }
    else if (this.data.userpw.length == 0) {
      wx.showToast({
        title: '密码为空',
        icon: 'success',
        duration: 2000
      })
    }
    else if (this.data.userpw!=this.data.userpw2) {
      wx.showToast({
        title: '两个密码不同',
        icon: 'success',
        duration: 2000
      })
    }
    else if (this.data.role.length == 0) {
      wx.showToast({
        title: '角色为空',
        icon: 'success',
        duration: 2000
      })
    }
    else if (this.data.userName.length == 0) {
      wx.showToast({
        title: '姓名为空',
        icon: 'success',
        duration: 2000
      })
    }
    else{
      var that=this;
      var retUrl="https://mobile.wuyou.com.cn/smartpark/testloginapi.asmx/registerAll";
      wx.request({
        url:retUrl,
        method:'POST',
        data:{
          account:that.data.userPhone,
          password:that.data.userpw,
          role:that.data.role,
          userName:that.data.userName,
          userwx:that.data.userwx
        },
        header:{'content-type': 'application/json;charset=utf-8'},
        success:function(res){
          var retData=JSON.parse(res.data.d);//转换为JSON格式
          console.log(retData);
          console.log(retData.code);
          if(retData.code==1){
            wx.showToast({
              title: '注册成功',
              icon:'success',
              duration:2000
            })
          }
          else{
            console.log(retData.message);
            wx.showModal({
              title: '注册不成功',
              content: '原因:'+retData.message,
              showCancel:false,
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  /*onLoad: function (options) {

  },*/

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  /*onReady: function () {

  },*/

  /**
   * 生命周期函数--监听页面显示
   */
  /*onShow: function () {

  },*/

  /**
   * 生命周期函数--监听页面隐藏
   */
  /*/onHide: function () {

  },*/

  /**
   * 生命周期函数--监听页面卸载
   */
  /*onUnload: function () {

  },*/

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  /*onPullDownRefresh: function () {

  },*/

  /**
   * 页面上拉触底事件的处理函数
   */
  /*onReachBottom: function () {

  },*/

  /**
   * 用户点击右上角分享
   */
  /*onShareAppMessage: function () {

  }*/
})