/* eslint-disable */
import '../../common/css/reset.css'
import './game_details.css';
import '../../common/css/dialog.css'
import {getQueryString, ajax, dialogs, urlPath} from '../../common/js/util.js'
const gameId = getQueryString('gameId') || ''
const token = getQueryString('token') || ''
const uuid = getQueryString('uuid') || ''
const banner = document.querySelector('.banner')
const detailsBox = document.querySelector('.details-box')
let order = 1
let clickFlag = true
dialogs.showLoading('拼命加载中...')

// 获取游戏详情
getGameInfo()
// 暴露给app，当游戏页面返回的时候调一次接口
window.getGameInfo = getGameInfo
function getGameInfo () {
  console.log('get')
  ajax({
    url: `${urlPath}games/gameInfo`,
    type: 'POST',
    async : true,
    data: {
      gameId,
      token,
      uuid
    },
    success: function(data){
      let rets = JSON.parse(data);
      if (rets.code === 1) {
        let {scoreRewards, gameUrl, gameImgUrl, gameName, gameMode, gameId} = rets.data
        banner.innerHTML = `<img src="${gameImgUrl}">`
        detailsBox.innerHTML = setDomHtml(scoreRewards)
        document.title = gameName
        // 触发下载事件
        playGame(gameMode, gameId, gameUrl)
        order ++
      }
      dialogs.hideLoading()
    },
    fail: function(e){
      dialogs.hideLoading()
      setTimeout(() => {
        dialogs.toast('加载失败', 'error')
      }, 100)
    }
  })
}


function setDomHtml (rets) {
  if (!rets.length) {return}
  let _html = ''
  rets.forEach((ret) => {
    let statusClass = ret.isReceive ? 'more' : 'more wait'
    // let statusClass = ret.isReceive ? 'more wait' : 'more wait'
    let statusTetx = ret.isReceive ? '已领取' : '未领取'
    // let statusTetx = ret.isReceive ? '去领取' : '去领取'
    _html += `<div class="details-inner">
    <div class="infos">${ret.description}</div>
    <div class="${statusClass}">
      <p class="money">+<span class="count">${ret.reward.toFixed(2)}</span>元</p>
      <p class="status">${statusTetx}</p>
    </div>
  </div>`
  })
  return _html
}

// 进入游戏之前调用一次接口后在跳到游戏页
function sendDataFuc () {
  return new Promise ((resolve, reject) => {
    ajax({
      url: `${urlPath}user/submitPlayGame`,
      type: 'POST',
      async : true,
      data: {
        gameId,
        token,
        uuid
      },
      success: function(data){
        resolve()
      },
      fail: function(e){
        resolve()
      }
    })
  })
}
// 触发跳转
function playGame (gameMode, gameId, url) {
  let waitBnt = document.querySelectorAll('.wait')
  let gameBtn = document.querySelector('.game-button')
  for (let k=0; k<waitBnt.length; k++) (
    (function(k){
      waitBnt[k].addEventListener('click', function(){
        if (clickFlag) {
          clickFlag = false
          sendDataFuc().then(() => {
            jumpToGame(gameMode, gameId, url)
          })
          setTimeout(() => {
            clickFlag = true
          }, 500)
        }
        
        
      })
    })(k)
  )
  if (order === 1) {
    gameBtn.addEventListener('click', () => {
      if (clickFlag) {
        clickFlag = false
        sendDataFuc().then(() => {
          jumpToGame(gameMode, gameId, url)
        })
        setTimeout(() => {
          clickFlag = true
        }, 500)
      }
    })
  }
  
}

// 跳转
function jumpToGame (gameMode, gameId, url) {
  window.android_xx.andoridGotoPlayGame(gameMode, gameId, url)
}