// pages/applybroker/applybroker.js
var QR = require("../../utils/qrcode.js");
var app = getApp();
var Update = require('../../utils/common.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isBrokerHidden:false,//是否是经纪人
        maskHidden: true,
        canvasHidden: false,
        imagePath: '',
        placeholder: 'https://github.com',//默认二维码生成文本
      access_token:'',
      imageData:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      that.getAccessToken();
        // 页面初始化 options为页面跳转所带来的参数
        // var size = this.setCanvasSize();//动态设置画布大小
        // var initUrl = this.data.placeholder;
        // this.createQrCode(initUrl, "mycanvas", size.w, size.h);
    },
    //生成access_token
    getAccessToken:function(){
      var that = this;
      wx.showLoading({
        title: 'Loading...',
      })
      wx.request({
        url: Update.httpGetAccessToken,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{
          nickName: app.globalData.userInfo.nickName,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          openId: app.globalData.openId
        },
        success: function (res) {
          wx.hideLoading();
          console.log('生成access_token');
          console.log(res);
          if(res.data.ret == '200'){
            that.setData({
              access_token: res.data.data.access_token
            })
            that.createMiniPro();

          } else {
            wx.showToast({
              title: '获取二维码出错',
              icon: 'none'
            })
          }
        },
        fail:function(){
          wx.hideLoading();
          wx.showToast({
            title: '连接出错',
            icon: 'none'
          })
        }
      })

    },
    //生成小程序二维码
    createMiniPro: function () {
      var that = this;
      console.log(that.data.access_token);
      wx.request({
        url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + that.data.access_token,
        // url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + '',
        method: 'POST',
        header: {
          'content-type': 'application/json;charset=utf-8' // 默认值
         // 'content-type': 'application/image/png'
        },
        data: {
        //  scene: app.globalData.phone,
         scene: 'jiancangscene=' + app.globalData.userId,
          page: '',
          width: 430,
          auto_color: false,
          line_color: { "r": "0", "g": "0", "b": "0" },
          is_hyaline: false
        },
        responseType:'arraybuffer',
        success: function (res) {
          console.log('生成小程序二维码');
          console.log(res);
          if(res.statusCode == '200'){
            that.setData({
            //  imageData: wx.base64ToArrayBuffer(res.data)
              imageData: wx.arrayBufferToBase64(res.data)//将 ArrayBuffer 数据转成 Base64 字符串
            })
           console.log("base64:" +that.data.imageData)
          } else {
            wx.showToast({
              title: '生成二维码出错',
              icon:'none'
            })
          }
        },
        fail:function(){
          wx.showToast({
            title: '连接出错',
            icon: 'none'
          })
        }

      })
    },
  





    setCanvasSize: function () {
        var size = {};

        try {
            /*var res = wx.getSystemInfoSync();
            var scale = 750/686;//不同屏幕下canvas的适配比例；设计稿是750宽
            var width = res.windowWidth/scale;
            var height = width;//canvas画布为正方形*/
            size.w = 160;
            size.h = 160;
        } catch (e) {
            // Do something when catch error
            console.log("获取设备信息失败" + e);
        }
        return size;
    },
    createQrCode: function (url, canvasId, cavW, cavH) {
        //调用插件中的draw方法，绘制二维码图片
        QR.api.draw(url, canvasId, cavW, cavH);
        setTimeout(() => {
            this.canvasToTempImage();
        }, 1000);

    },
    //获取临时缓存照片路径，存入data中
    canvasToTempImage: function () {
        var that = this;
        wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function (res) {
                var tempFilePath = res.tempFilePath;
                console.log(tempFilePath);
                that.setData({
                    imagePath: tempFilePath,
                    // canvasHidden:true
                });
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },
    //点击图片进行预览，长按保存分享图片
    previewImg: function (e) {
        var img = this.data.imagePath;
        console.log(img+"===");
        wx.previewImage({
            current: img, // 当前显示图片的http链接
            urls: [img] // 需要预览的图片http链接列表
        })
    },
  /*  formSubmit: function (e) {
        var that = this;
        var url = e.detail.value.url;
        that.setData({
            maskHidden: false,
        });
        wx.showToast({
            title: '生成中...',
            icon: 'loading',
            duration: 2000
        });
        var st = setTimeout(function () {
            wx.hideToast()
            var size = that.setCanvasSize();
            //绘制二维码
            that.createQrCode(url, "mycanvas", size.w, size.h);
            that.setData({
                maskHidden: true
            });
            clearTimeout(st);
        }, 2000)

    },*/


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
})