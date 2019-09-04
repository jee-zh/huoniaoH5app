/* eslint-disable */
import '../../common/css/reset.css'
import './withdraw.css';
import '../../common/css/dialog.css'
import {getQueryString, ajax, dialogs, publicPath, urlPath} from '../../common/js/util.js'
const token = getQueryString('token') || ''
const uuid = getQueryString('uuid') || ''
const openId = getQueryString('openId') || ''
const wxNumber = getQueryString('wxNumber') || ''

// 开发中注释
let choiceList = document.querySelectorAll('.select-count .item')
let withdrawBtn = document.querySelector('.foot .btn')
let money = document.querySelector('#money')
//上一个选择的金额序号
let lastIndex = -1
//当前选择的提现金额
let slelctCount = 0
let allowClick = true

let stop = false
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
      // 页面进来的查询才需要隐藏
      if (type === 1) {
        dialogs.hideLoading()
      }
      
      let datas = JSON.parse(data)
      if (datas.code === 1) {// 获取成功
        const {balance} = datas.data
        money.innerHTML = balance
        // 触发提现事件
        handleWithdrawClick(balance)
      }else{ // 获取失败
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

//提现
function handleWithdrawClick (money) {
  withdrawBtn.addEventListener('click', function(){
    // 当金额没选，并且标记（防止快速点击）没回源，不能触发事件
    if (withdrawBtn.classList.contains('disabled') || !allowClick) {return}
    if (stop) {return}
    allowClick = false
    setTimeout(() => {
      allowClick = true
    }, 300)
    if (parseInt(money) < 1) {
      dialogs.toast('余额小于最小提现金额~', 'error', 2000)
      return
    }
    if (parseInt(money) < parseInt(slelctCount)) {
      dialogs.toast('余额小于提现金额~', 'error', 2000)
      return
    }
    // 条件允许 触发提现
    handleWithdrawClickFuc(slelctCount)
  })
}

function handleWithdrawClickFuc(amount) {
  dialogs.alert('提现升级中，稍后开放~');
  return;
  dialogs.showLoading('申请提现中...')
  const data = {
    token,
    uuid,
    wxNumber,
    openId,
    amount,
    currency: ''
  }
  ajax({
    url: `${urlPath}withDraw/submitWithDraw`,
    type: 'POST',
    async : true,
    data,
    success: function(data){
      let datas = JSON.parse(data)
      let type = datas.code === 1 ? 'success' : 'error'
      setTimeout(() => {
        // 不管成功失败，都得触发提示信息，先隐藏加载提示
        dialogs.hideLoading('mask-white-dialog', function(){
          // 再调用一次获取金额接口 
          if (datas.code !== 1) {
            // getUserCount(2)
            dialogs.toast(datas.msg, type, 2000)
          }else{

            dialogs.alert('提现升级中，稍后开放~')
          }
          
          // -1未绑定微信 0失败， 1成功
          if (datas.code === -1) {
            // 跳往绑定微信页面
            setTimeout(() => {
              location.href = `${publicPath}bind.html?uuid=${uuid}&token=${token}`
            }, 800)
          }
        })
      }, 200)
    },
    fail: function(){
      dialogs.hideLoading()
      setTimeout(() => {
        dialogs.toast('网络异常~', 'error', 2000)
      }, 200)
    }
  })
}
//金额选择
handleChoiceClick()
function handleChoiceClick () {
  for (let i=0; i<choiceList.length; i++) {
    choiceList[i].addEventListener('click', function(){
      if (withdrawBtn.classList.contains('disabled')) {withdrawBtn.classList.remove('disabled')}
      if (lastIndex != i) {
        this.classList.add('active')
        lastIndex != -1 && choiceList[lastIndex].classList.remove('active')
        slelctCount = this.getAttribute('count')
        lastIndex = i
      }
      
    })
  }
}
// window.onpageshow = function (event) {
//   if (event.persisted) {
//     dialogs.toast('监测到返回', 'none', 2000)
//     window.android_xx.androidHideTXJL(0)
//   }
// }
// dialogs.toast('监测到返回！', 'none', 2000)
// 显示提现入口
// window.android_xx.androidHideTXJL(0);
