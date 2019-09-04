/* eslint-disable */
import '../../common/css/reset.css'
import './bind.css';
import '../../common/css/dialog.css'
import {getQueryString, ajax, dialogs, urlPath} from '../../common/js/util.js'
const token = getQueryString('token') || ''
const uuid = getQueryString('uuid') || ''
let button = document.querySelector('.button')
// 获取用户余额
dialogs.showLoading('拼命加载中...')
// 获取用户余额
getUserCount(1)
function getUserCount (type) {
  const data = {
    token,
    uuid
  }
  ajax({
    url: `${urlPath}home/info`,
    type: 'POST',
    async : true,
    data,
    success: function(data){
      if (type === 1) {
        dialogs.hideLoading()
      }
      
      let datas = JSON.parse(data)
      if (datas.code === 1) {
        const {balance} = datas.data
        money.innerHTML = balance
      }else{
        setTimeout(() => {
          dialogs.toast('用户金额获取失败~', 'error', 2000)
        }, 100)
      }
    },
    fail: function(){
      if (type === 1) {
        dialogs.hideLoading()
      }
      setTimeout(() => {
        dialogs.toast('网络异常~', 'error', 2000)
      }, 100)
    }
  })
}
button.addEventListener('click', function(){
  // 触发绑定微信
  window.android_xx.androidGotBindingWechat()
})
//没有认证通知app隐藏提现记录入口
//显示头部提现记录入口 
// window.android_xx.androidHideTXJL(1)