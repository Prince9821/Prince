// pages/modiPassword/modiPassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone:'',//手机号即账号
    userpwOld:'',//原密码
    userpw:'',//密码
    userpw2:'',//密码2
  },
  //设置数据成员新值的通用方法
  mySetData:function(e){
    var newValue=e.detail.value;//获取输入的值
    var keyName=e.target.dataset.keyname;//获取界面文件中wxml中data-keyname的值，即键名
    console.log(keyName+"="+newValue);
    var data={};//这是一个集合，在app中Bundle，由键名键值对组成
    data[keyName]=newValue;//给指定的键赋值，每个键名作为一个下标
    this.setData(data);//设置数据
  },
  //修改密码
  modiPassword: function (e) {
    if (this.data.userPhone.length == 0) {
      wx.showToast({
        title: '手机号为空',
        icon: 'success',
        duration: 4000
      })
    }
    else if (this.data.userpw.length == 0) {
      wx.showToast({
        title: '密码为空',
        icon: 'success',
        duration: 2000
      })
    }
    else if (this.data.userpw != this.data.userpw2) {
      wx.showToast({
        title: '两个密码不同',
        icon: 'success',
        duration: 2000
      })
    }
    else if (this.data.userpwOld.length == 0) {
      wx.showToast({
        title: '旧密码为空',
        icon: 'success',
        duration: 2000
      })
    }
    else {
      var that = this;
      var retUrl = "https://mobile.wuyou.com.cn/smartpark/testloginapi.asmx/modiPassword";
      wx.request({
        url: retUrl,
        method: 'POST',
        data: {
          account: that.data.userPhone,
          password: that.data.userpw,
          userpwOld: that.data.userpwOld
        },
        header: { 'content-type': 'application/json;charset=utf-8' },
        success: function (res) {
          var retData = JSON.parse(res.data.d);//转换为JSON格式
          console.log(retData);
          console.log(retData.code);
          if (retData.code == 1) {
            wx.showToast({
              title: '密码修改成功',
              icon: 'success',
              duration: 2000
            })
          }
          else {
            console.log(retData.message);
            wx.showModal({
              title: '密码没修改',
              content: '原因:' + retData.message,
              showCancel: false,
            })
          }
        }
      })
    }
  },
})