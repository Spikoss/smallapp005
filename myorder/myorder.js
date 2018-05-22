// pages/myorder/myorder.js
const app = getApp();
var Update = require('../../utils/common.js');
var st = 0;
var over = true;
Page({
  data: {
    orderList: [],
    isData: false,
    length: 0,
    orderDefault: '../../images/orderDefault.png'
  },

  orderDetail: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: "../myorder/orderdetail/orderdetail?orderId=" + that.data.orderList[index].orderId + "&orderNo=" + that.data.orderList[index].orderNo,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    st = 0;
    over = true;
    that.getOrderList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 我的订单
  getOrderList: function () {
    var that = this;
    wx.showLoading({
      title: 'loading',
    });
    wx.request({
      url: Update.httpOrderList,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: app.globalData.userId,
        st: st
      },
      success: function (opts) {
        console.log("我的订单 ")
        console.log(opts.data)
        if (opts.data.ret == '200') {
          that.setData({
            length: opts.data.data.length
          })
          if (opts.data.data.length < 8) {//一次性加载10条
            over = false;
          }
          that.setData({
            orderList: that.data.orderList.concat(opts.data.data)
          })
        } else {
          wx.showToast({
            title: '获取订单出错',
            icon: 'none'
          })
        }
        wx.hideLoading();
      },
      fail: function () {
        wx.showToast({
          title: '连接出错',
          icon: 'none'
        })
        wx.hideLoading();
      }
    })

  },
  /**
 * 到达底部触发分页加载
 */
  onReachBottom: function () {
    var that = this;
    console.log(over)
    if (over) {
      st = st + that.data.length;
      console.log(st);
      that.getOrderList();
    } else {
      that.setData({
        isData: true
      })

    }
  },
  
  //图片404触发改事件
  errorFunction: function (e) {
    var that = this;
    console.log(e.type);
    if (e.type == 'error') {
      var errorImgIndex = e.target.dataset.errorimg; //获取循环的下标
      var imgObject = "orderList[" + errorImgIndex + "].mainImg";//orderList为数据源，对象数组
      var errorImg = {};
      errorImg[imgObject] = that.data.orderDefault;//我们构建一个对象
      this.setData(errorImg); //修改数据源对应的数据
    }
  },


})