/* eslint-disable */
import '../../common/css/reset.css'
import '../../common/css/border.css'
import './income.css';
import '../../common/css/dialog.css'
import {getQueryString, ajax, dialogs, urlPath, scrollEvent} from '../../common/js/util.js'
let scrollTimer = null
let scrollFlag = true
let loading = true
let pageIndex = 1
let pageSize = 15
let token = getQueryString('token')
let uuid = getQueryString('uuid')
let more = document.querySelector('.weui-loadmore')
let listWrap = document.querySelector('.income-box')
let noRecord = document.querySelector('.no-record')
dialogs.showLoading('拼命加载中...')
loadMore()
document.addEventListener('scroll',function () {
  if (scrollFlag) {
    scrollFlag=false
    if(scrollEvent.getScrollHeight() <= scrollEvent.getDocumentTop() + scrollEvent.getWindowHeight() + 120){
      if (loading) {
        loading = false
        loadMore()
      }
    }
    scrollTimer = setTimeout(function(){
      scrollFlag = true
    },16)
  }
})
function loadMore(){
  ajax({
    url: `${urlPath}withDraw/incomeDetails`,
    type: 'POST',
    async : true,
    data: {
      token,
      uuid,
      pageIndex,
      pageSize
    },
    success: function(data){
      var data = JSON.parse(data);
      if (data.code === 1) {
        dialogs.hideLoading()
        var datas = data.data.data
        if (datas.length === 0) {
          if (pageIndex === 1) {
            noRecord.style.display="block"
            return
          }
          if(pageIndex >= 2) {
            more.style.display="block"
            more.innerHTML = '已经加载完啦~'
            more.style.color="#999999"
          }
          return
        }
        var html = setDomHtml(datas)
        noRecord.insertAdjacentHTML('beforebegin', html);
        pageIndex++
        loading = true
      }else{
        dialogs.hideLoading()
        setTimeout(() => {
          dialogs.toast('加载失败', 'error')
        }, 100)
      }
      
    },
    fail: function(e){
      loading = true
    }
  })
}

function setDomHtml (rets) {
  var html = '';
  for (let k=0; k<rets.length; k++) {
    html  += `<div class="list border-bottom">
    <div class="infos">
      <p class="type">${rets[k].desc}</p>
      <p class="time">${rets[k].createtime}</p>
    </div>
    <div class="count">+<span>${rets[k].money}</span>元</div>
  </div>`
  }
  return html
}

//显示头部提现记录入口 
// window.android_xx.androidHideTXJL(1)

