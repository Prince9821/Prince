// pages/upFileImg/upFileImg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [],//所有记录
    curIndex: 0,//当前行的下标号
    recordOne: null,//当前行对应的记录
    pagesize: '3',//每页10行
    pageindex: '2',//第几页
    cond: '-',//查询条件
    fieldlist: '-',//提取字段
    orderfield: 'idint',//排序用字段
    showDetail: false,//是否显示详情部分
    totalpage: 4,//总页
    totalline: 12,//总行数
    fieldName:'leftimage',//图像文件名保存到此
    fileType:"left",
    fileDir:"ysh",//文件夹可用`分隔，会依次建立
    fileLen:"4",//文件长度最多4MB
    fifleExt:",.jpg,.jpeg,.gif,.png",//文件类型，为了便于处理，前后加逗号
    userAccount:null,//用户账号
  },
  
  //此处代码有特殊性
  myUpFile:function(){
    var that=this;
    var fieldName=this.data.fieldName;
    var userAccount=app.globalData.userAccount;
    console.log("userAccount="+userAccount);
    if(userAccount){
      this.setData({
        "userAccount":userAccount,
      });
      //上传图片
      wx.chooseImage({
        count:3,//同时上传三个文件
        sizeType:['original','compressed'],
        sourseType:['album','camera'],//相册，相机
        success:function(res){
          var tempFilePaths=res.tempFilePaths;
          for(var i=0;i<tempFilePaths;i++){
            wx.uploadFile({
              url:"https://mobile.wuyou.com.cn/smartpark/testupFile.ashx",
              filePath:tempFilePaths[i],//tempFilePaths[0]表示首个，可选多个
              name:"upLoad",
              header:{
                "Content-Type":"nultipart/from-data"
              },
              formData:{
                "userName":userAccount,//账号
                "fileDir":that.data.fileDir,//文件目录
                "fileLen":that.data.fileLen,
                "fileType":that.data.fileType,//前方获取的值
                "fileExt":that.data.fileExt,
              },
              success:function(res){
                console.log(res.data);//这个语句确认不需要d，可直接转换
                var retData=JSON.parse(res.data);
                //目标文件名
                that.setData({
                  "destFileName":retData.destFileName,
                });
                //console.log.(retData);
                //此处要异步调用另一个API，将图像文件名URL值、用户账号、用户ID（GUID）写到此停车场的记录中
                var fileImageUrl ="https://mobile.wuyou.com.cn/smartpark/"+retData.destFileName;
                console.log(fileImageUrl);
                wx.request({
                  url:"https://mobile.wuyou.com.cn/smartpark/testloginapi.asmx/upFileImg",
                  method:'POST',
                  data:{
                    account:userAccount,
                    fieldName:that.data.fieldName,
                    fileImage:fileImageUrl,//上传成功返回的文件名
                  },
                  header:{
                    'content-type':'application/json;charset=utf-8'
                  },
                  success:function(res){
                    console.log(res.data);
                    var retData2=JSON.parse(res.data.d);//这是默认转换的，不是手转换，需要d
                    if(retData2.code==1){
                      wx.showModal({
                        title:'上传图片',
                        content:'上传成功!',
                        showCancel:false,
                      });
                      //重新读取数据，将新的一行读进来
                      that.getOnePage1();
                    }
                    else{
                      wx.showModal({
                        title:'上传出错',
                        content:'原因:'+retData2.message,
                        showCancel:false,
                      });
                    }
                  }
                });
              }
            })
          }
        }
      })
    }
    else{
      wx.showModal({
        tite:'没有登录',
        content:'请输入账号与密码登录',
        showCancel:false
      })
    }
  },
  getOnePage: function () {
    var that = this;
    wx.request({
      url: 'https://mobile.wuyou.com.cn/smartpark/testloginapi.asmx/getOnePageImage',
      method: 'POST',
      data: {
        cond: that.data.cond,
        fieldlist: that.data.fieldlist,
        orderfield: that.data.orderfield,
        pageindex: that.data.pageindex,
        pagesize: that.data.pagesize,
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
            "recordList": retData,//将相关数据写到data部分中
          });
          console.log(that.data.recordList);
        }
      }
    });
  },
  getOnePage1: function () {
    var that = this;
    //在onLoad中执行getOnePage1,它会返回总行数，从而可以算出总页数
    wx.request({
      url: 'https://mobile.wuyou.com.cn/smartpark/testloginapi.asmx/getOnePageImage1',
      method: 'POST',
      data: {
        cond: that.data.cond,
        fieldlist: that.data.fieldlist,
        orderfield: that.data.orderfield,
        pageindex: that.data.pageindex,
        pagesize: that.data.pagesize,
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
          that.setData({//将相关数据写到data部分中
            "recordList": retData,
            "totalline":retData[0].message,
          });
          console.log(that.data.recordList);
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options){
    this.getOnePage1();
  },
  //获取详情，只要从数组中取出当前行对象就可以了，这具有通用性
  //其他数据表的分页查询也可以实现
  auditRow:function(e){
    var curIndex = e.target.dataset.editindex;//行号
    var recordOne = this.data.recordList[curIndex];//当前行数据
    this.setData({
      "curIndex": curIndex,
      "recordOne": recordOne,
      "showDetail": true,
    });
  },
  returnParent: function () {
    this.setData({
      "showDetail": false,//不显示详情则恢复导航页面
    })
  },
  myFirst: function () {
    var pageindex = this.data.pageindex;
    pageindex = parseInt(pageindex);
    if (pageindex != 1) {//不是第一页则切换到第一页
      this.setData({
        "pageindex": '1',//第一页
      });
      this.getOnePage();
    }
  },
  myPre: function () {
    var pageindex = this.data.pageindex;
    pageindex = parseInt(pageindex);
    if (pageindex > 1) {//可以向前走则向前
      pageindex = pageindex - 1;
      this.setData({
        "pageindex": pageindex
      });
      this.getOnePage();
    }
  },
  myNext: function () {
    var pageindex = this.data.pageindex;
    pageindex = parseInt(pageindex);
    var totalpage = this.data.totalpage;
    totalpage = parseInt(totalpage);
    if (pageindex < totalpage) {
      pageindex = pageindex + 1;
      this.setData({
        "pageindex": pageindex
      });
      this.getOnePage();
    }
  },
  myBottom: function () {
    var pageindex = this.data.pageindex;
    pageindex = parseInt(pageindex);
    var totalpage = this.data.totalpage;
    totalpage = parseInt(totalpage);
    if (pageindex != totalpage) {//不是最后一页则设成最后一页
      this.setData({
        "pageindex": totalpage,//第一页
      });
      this.getOnePage();
    }
  },
  //输入页面，点击”去“
  inputPageNo: function (e) {
    var curpage = e.detail.value;//e.detail.dataset.keyname,是在data-keyname=''才可用
    curpage = parseInt(curpage);
    var totalpage = this.data.totalpage;
    totalpage = parseInt(totalpage);
    var pageindex = parseInt(this.data.pageindex);
    if (curpage != pageindex) {
      //不是当前页面
      if ((pageindex >= 1) && (pageindex <= totalpage)) {
        //合法范围内，则先保存
        this.setData({
          "pageindex": curpage,
        });
        //读取当前页的数据
        this.getOnePage();
      }
    }
  },
  //新的页长，重新计算总页数
  inputPageSize: function (e) {
    var pagesize = e.detail.value;
    pagesize = parseInt(pagesize);
    var pagesizeOld = parseInt(this.data.pagesize);//旧页长
    var totalline = parseInt(this.data.totalline);
    var totalpage = 0;
    var totalpageMod = 0;
    var totalpageOld = parseInt(this.data.totalpage);//旧的页数
    if (pagesize != pagesizeOld) {//新页长不等于旧页长
      this.setData({
        "pagesize": pagesize,//不同则保存新页长
      });
      if (totalline > 0) {
        //总行数存在
        totalpage = totalline / pagesize;
        totalpage = Math.ceil(totalpage);//有小数时整数部分加1
      }
      if (totalpage != totalpageOld) {
        //总页数不同
        this.setData({
          "totalpage": totalpage,
        });
      }
      this.getOnePage1();
    }
  },
})