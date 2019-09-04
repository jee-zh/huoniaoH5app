import {jsonp, dialogs, publicPath} from '../../common/js/util.js'
import '../../common/css/dialog.css'
let pubUrl = 'http://appapi.baomihua.com/AppInterface/UsersInterface/UserLogin.ashx'
// 获取用户信息
function getUserInfos (pmhUserId, type, fuc) {
  dialogs.showLoading('拼命加载中...');
  let data = {
    dataType: 'GetAuthenInfoV2',
    userId: pmhUserId
  }
  jsonp({
    url: pubUrl,
    type: 'GET',
    context: this,
    data,
    dataType: 'jsonp',
    jsonp: ('zepto' + (new Date().getTime())),
    success: function (data) {
      if (data.state !== '-1' && type !== 'again' && data.state !== '-2') { // 提交过认证并且不是重新认证，则跳到认证结果页，重新认证时不跳转到结果页
        location.href = publicPath + 'approve.html?userid=' + pmhUserId
      }
      dialogs.hideLoading();
      if (typeof (fuc) === 'function') {
        fuc(data.state)
      }
    },
    error: function () {
      dialogs.hideLoading()
      setTimeout(function () {
        dialogs.toast('信息获取失败~', 'error', 2000);
      }, 50)
    }
  })
}

function handleSumbitAjax (options, fuc) {
  dialogs.showLoading('提交中...');
  jsonp({
    url: pubUrl,
    type: 'GET',
    context: this,
    data: options,
    dataType: 'jsonp',
    jsonp: ('zepto' + (new Date().getTime())),
    success: function (data) {
      dialogs.hideLoading()
      if (data.state === 1) {
        dialogs.toast('提交成功~', 'success', 2000);
        setTimeout(() => {
          location.href = `${publicPath}approve.html?userid=${options.userId}`
        }, 2200)
      } else {
        var info = ''
        if (data.state === -1) {
          info = '已申请，请勿重复提交~'
        } else if (data.state === -2) {
          info = '开通账号数已达上限~'
        } else if (data.state === 0) {
          info = '注册失败~'
        }
        dialogs.toast(info, 'error', 2000);
      }
      if (typeof fuc === 'function') {
        fuc()
      }
    },
    error: function () {
      dialogs.hideLoading()
      dialogs.toast('提交失败，请重试~', 'error', 2000);
      if (typeof fuc === 'function') {
        fuc()
      }
    }
  })
}
export {
  pubUrl,
  getUserInfos,
  handleSumbitAjax
}
