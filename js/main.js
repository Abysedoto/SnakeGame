"use strict"
// all buttons for mobile
const topBtn = document.querySelector("#top")
const leftBtn = document.querySelector("#left")
const rightBtn = document.querySelector("#right")
const bottomBtn = document.querySelector("#bottom")
// 
const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d");
const record = document.querySelector(".recordAndControls span")
const game = document.querySelector(".game");
const score = document.querySelector(".score span")
canvas.width = game.clientWidth;
canvas.height = game.clientHeight;
ctx.fillStyle = "black"
let coordX;
let coordY;
if (localStorage.getItem('record') == undefined) {
  localStorage.setItem('record', 0)
  record.textContent = localStorage.getItem('record')
} else {
  record.textContent = localStorage.getItem("record")
}
// settings
let config = {
  step: 0, 
  lastStep: 3,
  score: 0,
}
let berry = {
  x: 0,
  y: 0, 
  width: 16/2.5,
  berryIsEated: true,
}
let snake = {
  speed: 3,
  x: 0,
  y: 0,
  xMove: 0,
  yMove: 3,
  width: 16,
  maxSize: 20,
  size: 6,
  trail: [[0, 0]],
}
// functions
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max-min) + min)
}
function changeScore() {
  config.score++
  score.textContent = config.score
}
function spawnBerry(coordX, coordY) {
  ctx.beginPath()
  ctx.arc(coordX, coordY, berry.width, 0, Math.PI*2)
  ctx.fill()
  berry.x = coordX;
  berry.y = coordY;
  berry.berryIsEated = false
  ctx.closePath()
}
function gameStart() {
  requestAnimationFrame(gameStart)
  if (snake.y < 0) {
    snake.y = canvas.height
  }
  if (snake.y > canvas.height) {
    snake.y = 0
  }
  if (snake.x > canvas.width) {
    snake.x = 0
  }
  if (snake.x < 0) {
    snake.x = canvas.width
  }
  // crashed?
  for (let i = 0; i < snake.trail.length-1; i++) {
    if (snake.trail.slice(-1)[0][0] == snake.trail[i][0] && snake.trail.slice(-1)[0][1] == snake.trail[i][1]
    ||  snake.trail.slice(-1)[0][0] == snake.trail[i][0] + snake.width && snake.trail.slice(-1)[0][1] == snake.trail[i][1] + snake.width) {
      // save in localStorage
      config.score > localStorage.getItem('record') ? localStorage.setItem('record', config.score) : false
      // 
      snake.speed = 3;
      snake.x = 0;
      snake.y = 0,
      snake.xMove = 0,
      snake.yMove = 3,
      snake.maxSize = 20,
      snake.trail = [[0, 0]]
      config.score = 0;
      score.textContent = config.score
      record.textContent = localStorage.getItem('record')
    }
  }
  // 
  snake.trail.push([snake.x += snake.xMove, snake.y += snake.yMove])
  if (snake.trail.length > snake.maxSize) {
    snake.trail.shift()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "red"
    if (snake.x < berry.x - berry.width + snake.width/2
    &&  snake.x + snake.width > berry.x
    &&  snake.y < (berry.y - berry.width + snake.width/2)
    &&  snake.y + snake.width > berry.y) {
      berry.berryIsEated = true;
      snake.maxSize += 15
      snake.speed += 0.1
      changeScore()
    }
    if (berry.berryIsEated == true) {
      coordX = getRandomNum(0, canvas.width)
      coordY = getRandomNum(0, canvas.height)
      spawnBerry(coordX, coordY)
    } else {
      spawnBerry(coordX, coordY)
    }
    ctx.fillStyle = "black"
  }
  for (let elem of snake.trail) {
    ctx.fillRect(elem[0], elem[1], snake.width, snake.width)
  }
}
requestAnimationFrame(gameStart)
// controls for Desktop
document.addEventListener("keydown", function(event) {
  if (event.code == "KeyW") {
    snake.xMove = 0;
    snake.yMove = -snake.speed;
  }
  if (event.code == "KeyS") {
    snake.xMove = 0;
    snake.yMove = snake.speed;
  }
  if (event.code == "KeyD") {
    snake.xMove = snake.speed;
    snake.yMove = 0;
  }
  if (event.code == "KeyA") {
    snake.xMove = -snake.speed;
    snake.yMove = 0;
  }
})
// controls for Mobile
topBtn.addEventListener("click", function(event) {
  snake.xMove = 0;
  snake.yMove = -snake.speed;
})
leftBtn.addEventListener("click", function(event) {
  snake.xMove = -snake.speed;
  snake.yMove = 0;
})
rightBtn.addEventListener("click", function(event) {
  snake.xMove = snake.speed;
  snake.yMove = 0;
})
bottomBtn.addEventListener("click", function(event) {
  snake.xMove = 0;
  snake.yMove = snake.speed;
})