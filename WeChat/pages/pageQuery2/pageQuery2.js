// pages/pageQuery2/pageQuery2.js
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
    showDetail:false,//是否显示详情部分
    totalpage:4,//总页
    totalline:12,//总行数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getOnePage:function(){
    var that=this;
    wx.request({
      url: 'https://mobile.wuyou.com.cn/smartpark/testloginapi.asmx/getOnePage',
      method:'POST',
      data:{
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
  onLoad: function (options) {
    var that = this;
    //在onLoad中执行getOnePage1，它会返回总行数，从而可以算出总页数
    wx.request({
      url: 'https://mobile.wuyou.com.cn/smartpark/testloginapi.asmx/getOnePage1',
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
  //获取详情
  auditRow: function (e) {
    var curIndex = e.target.dataset.editindex;//行号
    var recordOne = this.data.recordList[curIndex];//当前行数据
    this.setData({
      "curIndex": curIndex,
      "recordOne": recordOne,
      "showDetail":true,
    });
  },
  returnParent:function(){
    this.setData({
      "showDetail":false,//不显示详情则恢复导航页面
    })
  },
  myFirst:function(){
    var pageindex=this.data.pageindex;
    pageindex=parseInt(pageindex);
    if(pageindex!=1){//不是第一页则切换到第一页
      this.setData({
        "pageindex":'1',//第一页
      });
      this.getOnePage();
    }
  },
  myPre: function () {
    var pageindex = this.data.pageindex;
    pageindex = parseInt(pageindex);
    if (pageindex > 1) {//可以向前走则向前
      pageindex=pageindex-1;
      this.setData({
        "pageindex": pageindex
      });
      this.getOnePage();
    }
  },
  myNext: function () {
    var pageindex = this.data.pageindex;
    pageindex = parseInt(pageindex);
    var totalpage=this.data.totalpage;
    totalpage=parseInt(totalpage);
    if (pageindex < totalpage) {
      pageindex = pageindex+1;
      this.setData({
        "pageindex": pageindex
      });
      this.getOnePage();
    }
  },
   myBottom:function(){
     var pageindex = this.data.pageindex;
     pageindex = parseInt(pageindex);
     var totalpage = this.data.totalpage;
     totalpage = parseInt(totalpage);
    if(pageindex!=totalpage){//不是最后一页则设成最后一页
      this.setData({
        "pageindex":totalpage,//第一页
      });
      this.getOnePage();
    }
  },
  //输入页面，点击”去“
  inputPageNo:function(e){
    var curpage=e.detail.value;//e.detail.dataset.keyname,是在data-keyname=''才可用
    curpage=parseInt(curpage);
    var totalpage=this.data.totalpage;
    totalpage=parseInt(totalpage);
    var pageindex=parseInt(this.data.pageindex);
    if(curpage!=pageindex){
      //不是当前页面
      if((pageindex>=1)&&(pageindex<=totalpage)){
        //合法范围内，则先保存
        this.setData({
          "pageindex":curpage,
        });
        //读取当前页的数据
        this.getOnePage();
      }
    }
  },
  //新的页长，重新计算总页数
  inputPageSize:function(e){
    var pagesize=e.detail.value;
    pagesize=parseInt(pagesize);
    var pagesizeOld=parseInt(this.data.pagesize);//旧页长
    var totalline=parseInt(this.data.totalline);
    var totalpage=0;
    var totalpageMod=0;
    var totalpageOld=parseInt(this.data.totalpage);//旧的页数
    if(pagesize!=pagesizeOld){
      this.setData({
        "pagesize":pagesize,//不同则保存新页长
      });
      if(totalline>0){
        //总行数存在
        totalpage=totalline/pagesize;
        totalpage=Math.ceil(totalpage);//有小数时整数部分加1
      }
      if(totalpage!=totalpageOld){
        //总页数不同
        this.setData({
          "totalpage":totalpage,
        });
      }
    }
  },
})