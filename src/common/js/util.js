/* eslint-disable */
function idcard(value) {
  var isValid = true;
  var cityCode = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
  var rFormat =/^\d{6}(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$|^\d{6}\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}$/;    // 格式验证
  if ( !rFormat.test(value) || !cityCode[value.substr(0,2)] ) {
    isValid = false;
  }
  else if (value.length === 18) {
    var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // 加权因子
    var Ci = "10X98765432"; // 校验字符
    var sum = 0;
    for (var i = 0; i < 17; i++) {
      sum += value.charAt(i) * Wi[i];
    }
    var C17 = Ci.charAt(sum % 11);
    if ( C17 !== value.charAt(17) ) {
      isValid =false;
    }
  }
  return isValid;
}
function trim (value) {
  return value.replace(/ /g, '')
}

function jsonp(params) {
  params = params || {};
  params.data = params.data || {};
  var json = params.jsonp ? jsonp(params) : json(params);
  function jsonp(params) {
    var callbackName = params.jsonp;
    var head = document.getElementsByTagName('head')[0];
    params.data['callback'] = callbackName;
    var data = formatParams(params.data);
    var script = document.createElement('script');
    head.appendChild(script);
    window[callbackName] = function (json) {
      head.removeChild(script);
      clearTimeout(script.timer);
      window[callbackName] = null;
      params.success && params.success(json);
    };
    script.src = params.url + '?' + data;
    if (params.time) {
      script.timer = setTimeout(function () {
        window[callbackName] = null;
        head.removeChild(script);
        params.error && params.error({
          message: '超时'
        });
      }, time);
    }
  };

  function formatParams(data) {
    var arr = [];
    for (var name in data) {
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    };
    return arr.join('&')
  }
}

function getQueryString (name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}


  // let dialogs = {
  //   showLoading: function(string){
  //     var oMask = document.createElement('div')
  //     oMask.className = 'mask-white-dialog'
  //     oMask.innerHTML = '<div class="m-loading"><div class="loading-icon"></div><div class="loading-txt">'+string+'</div></div>'
  //     if (!document.querySelector('.mask-white-dialog')) {
  //       document.body.appendChild(oMask)
  //     }
  //   },
  //   hideLoading: function(){
  //     document.querySelector('.mask-white-dialog') && document.body.removeChild(document.querySelector('.mask-white-dialog'))
  //   },
  //   toast: function(string, type, time) {
  //     var oMask = document.createElement('div')
  //     var inner = ''
  //     oMask.className = 'mask-white-dialog'
  //     if (type === 'none' || type === '') {
  //       inner = '<div class="m-toast none-icon"><p class="toast-content">'+string+'</p></div>'
  //     }else if (type === 'error') {
  //       inner = '<div class="m-toast"><div class="toast-error-ico"></div><p class="toast-content">'+string+'</p></div>'
  //     }else if (type === 'success') {
  //       inner = '<div class="m-toast "><div class="toast-success-ico"></div><p class="toast-content">'+string+'</p></div>'
  //     }
  //     oMask.innerHTML = inner
  //     if (!document.querySelector('.mask-white-dialog')) {
  //       document.body.appendChild(oMask)
  //     }
  //     setTimeout(function(){
  //       document.querySelector('.mask-white-dialog') && document.body.removeChild(document.querySelector('.mask-white-dialog'))
  //     },time || 2000)
  //   }
  // }
  var dialogs = {
    showLoading: function(string, type){
      var dialog = document.createElement("div"),
      dislogClassName = type === 'black' ? "mask-black-dialog" : "mask-white-dialog";
      dialog.className = dislogClassName
      dialog.innerHTML = '<div class="m-loading"><div class="loading-icon"></div><div class="loading-txt">' + string + '</div></div>'
      !document.querySelector('.' + dislogClassName) && document.body.appendChild(dialog)
    },
    hideLoading: function(type, callback){
      var dislogClassName = type === 'black' ? "mask-black-dialog" : "mask-white-dialog";
      document.querySelector('.' + dislogClassName) && document.body.removeChild(document.querySelector('.' + dislogClassName))
      callback && callback()
    },
    toast: function(string, type, time, fuc, theme){
      var dialog = document.createElement("div"),
      dislogClassName = theme === 'black' ? "mask-black-dialog" : "mask-white-dialog";
      var html = ''
      if (type === 'none' || '') {
        html += '<div class="m-toast none-icon">'
      }else{
        html += '<div class="m-toast ">'
      }
      if (type === 'success') {
        html += '<div class="toast-success-ico"></div>'
      } else if (type === 'error') {
        html += '<div class="toast-error-ico"></div>'
      }
      dialog.className = dislogClassName
      html += '<p class="toast-content">' + string + '</p></div>'
      dialog.innerHTML = html
      !document.querySelector('.' + dislogClassName) && document.body.appendChild(dialog)
      setTimeout(function(){
        document.querySelector('.' + dislogClassName) && document.body.removeChild(document.querySelector('.' + dislogClassName))
        if (typeof fuc === 'function') {
          fuc()
        }
      }, time || 1500)
    },
    alert: function(string, fuc, theme){
      var dialog = document.createElement("div"),
      dislogClassName = theme === 'black' ? "mask-white-dialog" : "mask-black-dialog";
      dialog.className = dislogClassName
      dialog.innerHTML = '<div class="m-confirm m-alert"><div class="confirm-bd">' + string + '</div><div class="confirm-ft"><a href="javascript:;" class="confirm-btn primary">知道了</a></div></div>'
      !document.querySelector('.' + dislogClassName) && document.body.appendChild(dialog)
      document.querySelector('.' + dislogClassName).querySelector('.confirm-ft').onclick = function(){
        document.querySelector('.' + dislogClassName) && document.body.removeChild(document.querySelector('.' + dislogClassName))
        if (typeof fuc === 'function') {
          fuc()
        }
      }
    },
    confirm:function(title, content, optionsArray, theme){
      var dialog = document.createElement("div"),
      dislogClassName = theme === 'black' ? "mask-white-dialog" : "mask-black-dialog";
      dialog.className = dislogClassName
      var _html = '<div class="m-confirm"><div class="confirm-hd"><strong class="confirm-title">'+title+'</strong></div><div class="confirm-bd">'+content+'</div><div class="confirm-ft">'
      for (var k=0; k < optionsArray.length; k++) {
        if (optionsArray.length === 1) {
          if (optionsArray[k].color) {
            _html += '<a href="javascript:;" class="confirm-btn default" style="color:'+optionsArray[k].color+'">' + optionsArray[k].txt + '</a>'
          }else{
            _html += '<a href="javascript:;" class="confirm-btn default">' + optionsArray[k].txt + '</a>'
          } 
        }else if (optionsArray.length === 2) {
          if (k === 0) {
            if (optionsArray[k].color) {
              _html += '<a href="javascript:;" class="confirm-btn default" style="color:'+optionsArray[k].color+'">' + optionsArray[k].txt + '</a>'
            }else{
              _html += '<a href="javascript:;" class="confirm-btn default">' + optionsArray[k].txt + '</a>'
            } 
          }else if (k === 1) {
            if (optionsArray[k].color) {
              _html += '<a href="javascript:;" class="confirm-btn primary" style="color:'+optionsArray[k].color+'">' + optionsArray[k].txt + '</a>'
            }else{
              _html += '<a href="javascript:;" class="confirm-btn primary">' + optionsArray[k].txt + '</a>'
            } 
          }
        }
      }
      _html += '</div></div>'
      dialog.innerHTML = _html
      !document.querySelector('.' + dislogClassName) && document.body.appendChild(dialog)
      var dislogBox = document.querySelector('.' + dislogClassName)
      for (var i=0; i<optionsArray.length; i++) {
        (function(h){
          dislogBox.querySelectorAll('.confirm-btn')[h].onclick = function(){
            dislogBox && document.body.removeChild(dislogBox);
            if (optionsArray[h].callback && typeof(optionsArray[h].callback) === 'function') {
              optionsArray[h].callback()
            }
          }
        })(i)
      }
    },
    notify: function(string, times, fuc){
      var dialog = document.createElement("div"),
      dislogClassName = "m-notify";
      dialog.className = dislogClassName
      dialog.innerHTML = string
      if(!document.querySelector('.' + dislogClassName)){
        !document.querySelector('.' + dislogClassName) && document.body.appendChild(dialog)
        notifytime = setTimeout(function(){
          dialog.classList = 'm-notify notify-out'
          if (typeof fuc === 'function') {
            fuc()
          }
          notifytimer = setTimeout(function(){
            console.log(2)
            document.querySelector('.' + dislogClassName) && document.body.removeChild(document.querySelector('.' + dislogClassName))
          }, 35)
          
        }, times || 2000)
      }
      
    }
  }
  function ajax (options){
    var xhr = null;
    var params = formsParams(options.data);
    //创建对象
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // 连接
    if(options.type == "GET"){
        xhr.open(options.type,options.url + "?"+ params,options.async);
        xhr.send(null)
    } else if(options.type == "POST"){
        xhr.open(options.type,options.url,options.async);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(params);
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if (xhr.status == 200) {
            options.success(xhr.responseText);
          }else{
            options.fail && options.fail(xhr.status);
          }
        }
    }
    function formsParams(data){
        var arr = [];
        for(var prop in data){
            arr.push(prop + "=" + data[prop]);
        }
        return arr.join("&");
    }
}
let scrollEvent = {
  getDocumentTop:function  () {
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
  },
  getWindowHeight:function () {
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
      windowHeight = document.documentElement.clientHeight;
    } else {
      windowHeight = document.body.clientHeight;
    }
    return windowHeight;
  },
  getScrollHeight:function () {
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
}

  // 打包页面路径
  let publicPath = './'
  let urlPath = 'http://gameapi.29293.com/api/'
  // let urlPath = 'http://192.168.30.31/api/'
export {
  idcard,
  trim,
  jsonp,
  getQueryString,
  dialogs,
  ajax,
  publicPath,
  urlPath,
  scrollEvent
}