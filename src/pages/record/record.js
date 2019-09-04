/* eslint-disable */
import '../../common/css/reset.css'
import '../../common/css/border.css'
import './record.css';
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
let listWrap = document.querySelector('.list-wrap')
let noRecord = document.querySelector('.no-record')
dialogs.showLoading('拼命加载中...')
loadMore()
document.addEventListener('scroll',function () {
  if (scrollFlag) {
    scrollFlag=false
    //var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //if(docHeight <= wHeight + scrollTop + 30 ) {
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
    url: `${urlPath}withDraw/withDrawDetails`,
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
        
      } else {
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
    html += '<div class="list border-bottom">\
    <div class="content">\
      <span class="name">'+rets[k].desc+'</span><span class="count"><em>'+(rets[k].money>=500 ? rets[k].money/100 : rets[k].money)+'</em>元</span>\
    </div>\
    <div class="infos">\
      <span class="time">'+rets[k].createtime+'</span>'
    if(rets[k].statusName === '申请中'){
      html += '<span class="state waitting">'+rets[k].statusName+'</span>'
    }else{
      html += '<span class="state">'+rets[k].statusName+'</span>'
    }
  
    html += '</div></div>'
  }
  return html
}
function getDocumentTop () {
  var scrollTop = 0,
    bodyScrollTop = 0,
    documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}
function getWindowHeight() {
  var windowHeight = 0;
  if (document.compatMode == "CSS1Compat") {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
}
function getScrollHeight() {
  var scrollHeight = 0,
    bodyScrollHeight = 0,
    documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
  return scrollHeight;
}
//显示头部提现记录入口 
// window.android_xx.androidHideTXJL(1)
