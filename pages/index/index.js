//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');
Page({
  data: {
    showIs:false,
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    testImg: "../icon/Bitmap.png",
    imglist: [],
    hosDetail: '',
    departDetail: '',
    docList: [],
    bgUrl1: app.globalData.url + '/wxminapp-resource/1.png',
    bgUrl2: app.globalData.url + '/wxminapp-resource/2.png',
    bgUrl3: app.globalData.url + '/wxminapp-resource/3.png',
    canvasShow: false,
    change: 0,
    ids: ''
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  // 搜索跳转
  searchkey(e) {
    wx.navigateTo({
      url: '../searchPage/searchPage',
    })
  },
  // 查看二维码
  // lookCode(e) {
  //   // var current =  e.currentTarget.dataset.src;
  //   wx.previewImage({
  //     // current: current, // 当前显示图片的http链接
  //     urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
  //   })
  // },
  lookBigPic(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: [e.currentTarget.dataset.src]
    })
  },
  scan(e) {
    wx.scanCode({
      success(res) {
        wx.reLaunch({
          url: '../index/index?hospitalid=1&hospitalname=忠安医院',
        })
        // if (res.path.slice(3, 4) == 'i') {
        //   wx.reLaunch({
        //     url: res.path,
        //   })
        // } else {
        //   wx.navigateTo({
        //     url: res.path,
        //   })
        // }

      }
    })
  },
  evaList(e) {
    wx.navigateTo({
      url: '../evaList/evaList?type=' + e.currentTarget.dataset.type + '&detail=' + JSON.stringify(this.data.depart),
    })
  },
  evadepart(e) {
    wx.navigateTo({
      url: '../evadepart/evadepart?detail=' + JSON.stringify(this.data.depart),
    })
  },
  panoramaVrUrl(e) {
    wx.navigateTo({
      url: '../webview/webview?href=' + encodeURIComponent(app.globalData.url + this.data.hosDetail.panoramaVrUrl),
    })
  },
  //事件处理函数
  bindViewTap: function () {

  },

  hosDetail() {
    var that = this
    // wx.showToast({
    //   title:  wx.getStorageSync('loginHospitalId'),
    //   icon:"none"
    // })
    // if(!wx.getStorageSync('loginHospitalId')){
    //   wx.showToast({
    //     title: '请扫码登录',
    //     icon:'none',
    //     duration:3000
    //   })
    //   return
    // }
    that.setData({
      loginHospitalId11: wx.getStorageSync('loginHospitalId'),
    })
    wx.request({
      url: app.globalData.url + '/ypt/user/hospital',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      data: {
        hospitalId: wx.getStorageSync('loginHospitalId'), // app.globalData.loginHospitalId,
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            loginHospitalId111: res.data.data.name,
            loginHospitalId222: res.data.data.hospitalId
          })
          app.globalData.hospitalName = res.data.data.name
          app.globalData.hospitaiDetail = res.data.data
          var tag = []
          res.data.data.cover = app.cover(res.data.data.cover)
          if (res.data.data.tag) {
            if (res.data.data.tag.split(',')) {
              for (var i in res.data.data.tag.split(',')) {
                tag.push(res.data.data.tag.split(',')[i])
              }
            } else {
              tag.push(res.data.data.tag)
            }
          }
          res.data.data.tag = tag
          that.setData({
            hosDetail: res.data.data,
            testImg: res.data.data.cover,
          })
          var param = encodeURIComponent('pages/index/index?hospitalid=' + app.globalData.hospitaiDetail.hospitalId + '&hospitalname=' + app.globalData.hospitaiDetail.name)
          wx.getImageInfo({
            src: app.globalData.url + '/ypt/wxminqrcode?path=' + param + '&width=2',
            method: 'get',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            success: function (res) {
              var imglist = []
              imglist.push(res.path)
              that.setData({
                tcode: res.path,
                imglist: imglist,
              })
              // if(!that.data.avatorShare){
              //   that.lookCode()
              // }
            },
            fail(res) {
              console.log(res)
            }
          })
        } else if (res.data.code == 1404 || res.data.code == 1001) {
          wx.showToast({
            title: '请选择一个医院',
            icon: 'none',
            duration: 2000,
            success: function (res) {
              wx.navigateTo({
                url: '../hosList/hosList',
              })
            },
            complete: function (res) {
              console.log(res)
            },
          })
          // wx.showModal({
          //   content: '请先选择一个医院',
          //   showCancel: false,
          //   success(res) {
          //     if (res.confirm) {
          //       wx.navigateTo({
          //         url: '../hosList/hosList',
          //       })
          //     }
          //   }
          // })


        }
      }
    })
  },
  departDetail() {
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/user/offices',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      data: {
        pn: 1,
        ps: 200,
        hosptialId: wx.getStorageSync('loginHospitalId')
      },
      success: function (res) {

        if (res.data.code == 0) {
          var departDetail = ''
          if (res.data.data.rows) {
            for (var i in res.data.data.rows) {
              departDetail = departDetail + "/" + res.data.data.rows[i].name
            }
            departDetail = departDetail.slice(1, departDetail.length)
            that.setData({
              departDetail: departDetail,
              depart: res.data.data.rows
            })
          }

        }
        // else {
        //   wx.showToast({
        //     title: res.data.codeMsg,
        //     icon: 'none',
        //     duration: 2000,
        //     mask: true,
        //     complete: function complete(res) {
        //       setTimeout(function () {
        //         // wx.setStorageSync('codeType', that.data.type)
        //         wx.navigateTo({
        //           url: '../hosList/hosList',
        //         })
        //       }, 500);
        //     }
        //   });
        // }
      }
    })
  },
  docList() {
    var that = this
    wx.request({
      url: app.globalData.url + '/ypt/user/doctors',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      data: {
        hosptialId: wx.getStorageSync('loginHospitalId'),
        pn: 1,
        ps: 5,
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.rows) {
            for (var i in res.data.data.rows) {
              res.data.data.rows[i].cover = app.cover(res.data.data.rows[i].cover)
            }
          }
          that.setData({
            docList: res.data.data.rows
          })
        }
        // else if (res.data.code == 20) {
        //   wx.showToast({
        //     title: res.data.codeMsg,
        //     icon: 'none',
        //     duration: 2000,
        //     mask: true,
        //     complete: function complete(res) {
        //       setTimeout(function () {
        //         wx.setStorageSync('codeType', that.data.type)
        //         wx.navigateTo({
        //           url: '../login/login',
        //         })
        //       }, 500);
        //     }
        //   });
        // } 
        // else {
        //   wx.showToast({
        //     title: res.data.codeMsg,
        //     icon: 'none',
        //   })
        // }
      }
    })
  },
  onLoad: function (options) {
    let that = this
    console.log(options)
    that.setData({
      version: app.version,
      entityTel: app.globalData.entity.entityTel,
    })
    if (options && options.hospitalid) {
      that.setData({
        ids: options.hospitalid
      })
      wx.setStorageSync('loginHospitalId', options.hospitalid)
      wx.setStorageSync('loginHpitalName', options.hospitalname)
      // that.hosDetail();
      // wx.showToast({
      //   title: '1',
      // })
    } else {
      // wx.showToast({
      //   title: '2',
      // })
      // that.hosDetail();
    }
    that.sys();

    let hospitalId = ''
    if (options && options.hospitalid) {
      hospitalId = options.hospitalid
    } else if (wx.getStorageSync('loginHospitalId')) {
      hospitalId = wx.getStorageSync('loginHospitalId')
    } else {
      hospitalId = ''
    }
    console.log('hospitalId=' + hospitalId)
    that.setData({
      hospitalIdXIanshi: hospitalId
    })
    wx.login({
      success(res) {
        var code = res.code
        wx.request({
          url: app.globalData.url + '/ypt/user/login-by-wxminapp-jscode',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: 'post',
          data: {
            wsJsCode: code,
            loginHospitalId: hospitalId,
          },
          success: function (res) {
            // wx.hideToast()
            if (res.data.code == 0) {
              // wx.showToast({
              //   title: hospitalId,
              // })

              that.setData({
                hospitalIdXIanshi1: hospitalId
              })
              console.log('wxLogin')
              wx.setStorageSync('cookie', res.header['Set-Cookie'])
              wx.request({
                url: app.globalData.url + '/ypt/user/login-refresh',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  'cookie': wx.getStorageSync('cookie')
                },
                method: 'post',
                success: function (res) {
                  // wx.hideToast()
                  if (res.data.code == 0) {
                  
                    that.departDetail();
                    that.docList();
                    that.hosDetail();
                    that.setData({
                      loginHospitalId1: res.data.data.hospitalId,
                      loginHpitalName1: res.data.data.hospitalName
                    })
                    app.globalData.userInfoDetail = res.data.data
                    wx.setStorageSync('loginHospitalId', res.data.data.hospitalId)
                    wx.setStorageSync('loginHpitalName', res.data.data.hospitalName)

                  } else {
                    wx.showToast({
                      title: res.data.codeMsg,
                      icon: 'none'
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: res.data.codeMsg,
                icon: 'none'
              })
            }
          }
        })
      }
    })


  },
  onShow: function (options) {
    let that=this
    wx.request({
      url: app.globalData.url + '/ypt/user/login-refresh',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'post',
      success: function (res) {
        // wx.hideToast()
        if (res.data.code == 0) {
          if(!res.data.data.phone){
            that.setData({
              showIs: true
            })
          }
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none'
          })
        }
      }
    })
    that.setData({
      canvasShow: false
    })
    if (options && options.hospitalid) {
      wx.setStorageSync('loginHospitalId', options.hospitalid)
      wx.setStorageSync('loginHpitalName', options.hospitalname)
    }
    console.log(wx.getStorageSync('historyUrl'))
    if (wx.getStorageSync('historyUrl') && wx.getStorageSync('fromTab') == 1) {
      wx.switchTab({
        url: wx.getStorageSync('historyUrl'),
      })
      wx.setStorageSync('fromTab', '')
    } else if (wx.getStorageSync('historyUrl') && wx.getStorageSync('fromTab') == 0) {
      console.log(wx.getStorageSync('historyUrl'))
      console.log(wx.getStorageSync('historyUrl') + "?type=" + wx.getStorageSync('type') + "&id=" + wx.getStorageSync('id') + '&hospitalid=' + wx.getStorageSync('loginHospitalId'))
      wx.navigateTo({
        url: wx.getStorageSync('historyUrl') + "?type=" + wx.getStorageSync('type') + "&id=" + wx.getStorageSync('id') + '&hospitalid=' + wx.getStorageSync('loginHospitalId'),
      })
      wx.setStorageSync('historyUrl', '')
    }
    if (that.data.change == 1) {
      that.setData({
        change: 0
      })
      that.hosDetail();
    }

    that.departDetail();
    that.docList();

    // console.log(app.globalData.hospitaiDetail)

  },
  onReady: function () {
    this.setData({
      allHidden: 'none'
    })
  },
  lookMoreDetail(e) {
    wx.navigateTo({
      url: '../hosIndex/hosIndex?detail=' + JSON.stringify(e.currentTarget.dataset.detail),
    })
  },
  doctor(e) {
    wx.navigateTo({
      url: '../doctor/doctor?id=' + e.currentTarget.dataset.id + '&type=1' + '&detail=' + JSON.stringify(e.currentTarget.dataset.detail),
    })
  },
  onPullDownRefresh: function () {
    // this.setData({
    //   hosDetail: '',
    //   departDetail: '',
    //   docList: [],
    // })
    this.hosDetail()
    this.departDetail()
    this.docList()
    wx.stopPullDownRefresh()
  },
  // 分享
  onShareAppMessage: function (res) {
    wx.request({
      url: app.globalData.url + '/ypt/user/share',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {

        }
      }
    })

  },
  // canvas绘图部分
  sys: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight,
          windowTop: (res.windowHeight - res.windowWidth) / 2
        })
      },
    })
  },
  // bginfo: function () {
  //   var that = this;
  //   console.log( that.data.avator)
  //   wx.downloadFile({
  //     url: that.data.avator,//注意公众平台是否配置相应的域名
  //     success: function (res) {
  //       console.log( res)
  //       that.setData({
  //         avatorShare: res.tempFilePath
  //       })

  //     }
  //   })
  // },
  canvasdraw: function (canvas) {
    var that = this;

    console.log(that.data.testImg)
    that.setData({
      canvasShow: true
    })
    wx.downloadFile({
      url: that.data.testImg, //注意公众平台是否配置相应的域名
      success: function (res) {
        console.log(res.tempFilePath)
        that.setData({
          avatorShare: res.tempFilePath
        })
        var leftW = (that.data.windowW - 220) / 2
        var windowW = that.data.windowW;
        var windowH = that.data.windowH;
        console.log(windowW, windowH)
        canvas.drawImage('../icon/fang.png', 0, 0, windowW, windowW);
        canvas.drawImage(that.data.avatorShare || '../icon/Bitmap.png', 15, 30, 50, 50);
        canvas.drawImage(that.data.imglist[0], leftW, 100, 220, 220);
        // canvas.setFontSize(50)
        canvas.font = "20px Georgia";
        // if(that.data.detail.type2NurseName){
        //   canvas.fillText('护士：'+that.data.detail.type1DoctorName, 70, 50)
        // }else if(that.data.detail.type1DoctorName){
        canvas.fillText(that.data.hosDetail.name, 70, 50)
        // }
        // canvas.font="15px Georgia";
        // canvas.fillText( app.globalData.hospitalName, 70, 70)
        canvas.draw(true, setTimeout(function () {

          that.saveCanvas()

          // setTimeout(function(){

          // },200)
        }, 100));
      }
    })

    console.log(that.data.avatorShare, that.data.imglist[0])



    // canvas.draw();
  },
  saveCanvas: function () {
    console.log('a');

    var that = this;

    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    console.log(windowW, windowH);
    that.setData({
      canvasShow: true
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: windowW,
      height: windowW,
      destWidth: windowW,
      destHeight: windowW,
      canvasId: 'canvas',
      success: function (res) {
        console.log(res.tempFilePath)

        that.setData({
          urls: res.tempFilePath
        })
      },
      error: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  lookCode: function () {
    var that = this;
    var canvas = wx.createCanvasContext('canvas');
    that.canvasdraw(canvas);
    // that.setData({
    //   canvasShow:true
    // })
  },
  lookCodeShow() {
    var that = this
    if (that.data.imglist) {
      // that.setData({
      //   canvasShow:true
      // })
      // that.lookCode()
      console.log(that.data.hosDetail.name, that.data.imglist[0], that.data.testImg)
      if (that.data.imglist[0] && that.data.hosDetail.name && that.data.testImg) {
        wx.navigateTo({
          url: '../canvasHos/canvasHos?img=' + that.data.imglist[0] + '&cover=' + that.data.testImg + '&name=' + that.data.hosDetail.name+"&id="+that.data.hosDetail.hospitalId,
        })
      } else {
        wx.showToast({
          title: '二维码生成中,请稍后重试',
          icon: 'none'
        })
      }

    } else {
      wx.showToast({
        title: '维护中',
        icon: 'none'
      })
    }
    // console.log(112121)
    // console.log(that.data.urls)
    // wx.previewImage({
    //   urls: [that.data.urls],
    // })
    // that.saveCanvas()
  },
  closeCanvas: function () {
    var that = this;
    that.setData({
      canvasShow: false
    })
  },
  saveIs: function () {
    var that = this
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.urls,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
            }
          }
        })
      }
    })
  },
  refuse(e) {
    this.setData({
      showIs: false
    })
  },
  getPhoneNumber(e) {
let that=this
    wx.login({
      success(res) {
        console.log(res)
        var code = res.code
        if(!e.detail.encryptedData||!e.detail.iv){
          // wx.showToast({
          //   title: '获取手机号失败',
          //   icon:'none'
          // })
          that.setData({
            showIs:false
          })
          return
        }
        wx.request({
          url: app.globalData.url + '/ypt/user/bind-phone',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'cookie': wx.getStorageSync('cookie')
          },
          method: 'post',
          data: {
            wsJsCode: code,
            // loginHospitalId: wx.getStorageSync('loginHospitalId'),
            wxMinappencryptedDataOfPhoneNumber: e.detail.encryptedData || '',
            wxMinappIv: e.detail.iv || '',
          },
          success: function (res) {
            wx.hideToast()
            if (res.data.code == 0) {

              // wx.setStorageSync('cookie', res.header['Set-Cookie'])
              wx.request({
                url: app.globalData.url + '/ypt/user/login-refresh',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  'cookie': wx.getStorageSync('cookie')
                },
                method: 'post',
                success: function (res) {
                  wx.hideToast()
                  if (res.data.code == 0) {
                    app.globalData.userInfoDetail = res.data.data
                  
                    wx.setStorageSync('loginHospitalId', res.data.data.hospitalId)
                    wx.setStorageSync('loginHpitalName', res.data.data.hospitalName)
                    wx.showToast({
                      title: '绑定成功',
                      icon: 'none',
                      duration: 2000,
                      mask: true,
                      complete: function(res) {
                        setTimeout(function () {    
                          that.setData({
                            showIs: false,
                          })      
                        }, 500);
                      }
                    });

                  } else {
                    wx.showToast({
                      title: res.data.codeMsg,
                      icon: 'none'
                    })
                  }
                }
              })


            } else {
              wx.showToast({
                title: res.data.codeMsg,
                icon: 'none'
              })
            }
          }
        })
      },
      error:function(error){
        console.log(error)
      }
      
    })

  },
})