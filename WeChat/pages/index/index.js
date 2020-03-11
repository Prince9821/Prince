//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World \n',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    videoa: 'http://video.sina.com.cn/news/spj/topvideos20190108/?opsubject_id=top1#275475370',
    videob: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    myAccount:'',//保存账号
    myPassword:'',//保存密码
  },
  //给账号赋值
  myAccountInput:function(e){
    var myAccount=e.detail.value;//获取input即输入框中的值
    this.setData({
      'myAccount':myAccount,//将输入框中的值保存到data中，注意要使用this.setData，而不是直接赋值
    });
  },
  //给密码赋值
  myPasswordInput:function(e){
    var myPassword = e.detail.value;//获取input即输入框中的值
    this.setData({
      'myPassword': myPassword,//将输入框中的值保存到data中，注意要使用this.setData，而不是直接赋值
    });
  },
  //上传图像文件
  myUpFileImg:function(){
    var retUrl="../upFileImg/upFileImg";
    wx.navigateTo({
      url: retUrl,
    })
  },
  //分页显示2
  myPageQuery2: function () {
    var retUrl = "../pageQuery2/pageQuery2";
    wx.navigateTo({
      url: retUrl,
    })
  },
  //分页显示
  myPageQuery:function(){
    var retUrl="../pageQuery/pageQuery";
    wx.navigateTo({
      url: retUrl,
    })
  },
  //修改密码
  myModiPassword:function(){
    var retUrl="../modiPassword/modiPassword";
    wx.navigateTo({
      url: retUrl,
    })
  },
  //跳转到注册页面
  myRegister:function(){
    var retUrl='../register/register';
    wx.navigateTo({
      url: retUrl,
    });
    /*二者区别
    wx.redirectTo({
      url:retUrl,
    });*/
  },
  //开始登录
  myLogin:function(){
    var myAccount=this.data.myAccount;
    var myPassword=this.data.myPassword;
    console.log("账号:"+myAccount);
    console.log("密码:"+myPassword);
    //开始登录代码，这是跟后端联系的方式
    wx.request({
      url: 'https://mobile.wuyou.com.cn/smartpark/testloginapi.asmx/login',
      method:'POST',
      data:{account:myAccount,password:myPassword},
      header:{'content-type': 'application/json;charsset=utf-8'},
      success:function(res){
        console.log(res.data);console.log(res.data.d);
        var retData=JSON.parse(res.data.d);//转换为JSON格式
        console.log(retData);
        if(retData.code==1){
          wx.showToast({
            title:'登录成功',
            icon:'success',
            duration:2000 //2000毫秒，2秒
          });
          app.globalData.userAccount=myAccount;//全局变量可以直接赋值，页面变量必须用setData() 
        }
        else{
          wx.showModal({
           title: '登录不成功',
           content: '原因:'+retData.message,
           showCancel:false,
         })
        }
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
