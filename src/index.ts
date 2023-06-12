import './style/index.less'



class Food {
  element: HTMLElement

  constructor() {
    this.element = document.querySelector('.food');
    this.setOpsition()
  }
  get foodX() {
    return this.element.offsetLeft
  }
  get foodY() {
    return this.element.offsetTop
  }

  setOpsition() {
    // 生成随机坐标
    let x: number = Math.floor(Math.random() * 30) * 10;
    let y: number = Math.floor(Math.random() * 30) * 10;
    this.element.style.left = x + 'px'
    this.element.style.top = y + 'px'
  }
}

class Scoreboard {
  fraction: number = 0;
  level: number = 1;
  maxLevel: number
  stepLevel: number
  // 元素
  fractionDom: HTMLElement
  levelDom: HTMLElement
  constructor(maxLevel: number = 10, stepLevel: number = 10) {
    this.maxLevel = maxLevel
    this.stepLevel = stepLevel
    this.fractionDom = document.querySelector('.fraction')
    this.levelDom = document.querySelector('.level')
  }

  addFraction() {
    this.fraction = this.fraction + 1
    this.fractionDom.innerText = this.fraction + ''
  }
  addLevel() {
    if (this.level >= this.maxLevel) return
    this.level = this.level + 1
    this.levelDom.innerText = this.level + ''
  }
}

class Snake {
  snakeHeader: HTMLElement
  snakeBody: HTMLCollection

  constructor(snakeHeaderX: number = 0, snakeHeaderY: number = 0,) {
    this.snakeHeader = document.querySelector('.snake')
    this.snakeBody = document.getElementsByClassName('snake') as HTMLCollection
    this.initSnakeOpsition(snakeHeaderX, snakeHeaderY)
  }
  get snakeHeaderX() {
    return this.snakeHeader.offsetLeft
  }
  get snakeHeaderY() {
    return this.snakeHeader.offsetTop
  }

  set snakeHeaderX(val: number) {
    this.crossBoundary(val)
    this.moveBody()
    this.snakeHeader.style.left = val + 'px'
  }
  set snakeHeaderY(val: number) {
    this.crossBoundary(val)
    this.moveBody()
    this.snakeHeader.style.top = val + 'px'

  }

  initSnakeOpsition(x: number, y: number) {
    this.snakeHeaderX = x
    this.snakeHeaderY = y
  }

  addSnakeBody() {
    const div = document.createElement('div')
    div.className = 'snake'
    document.querySelector('#stage').appendChild(div)
    this.moveBody()
  }
  // 撞墙检测
  crossBoundary(val: number) {
    if (val < 0 || val > 290) {
      throw '撞墙了'
    }
  }

  // 移动身体
  moveBody() {
    for (let i = this.snakeBody.length - 1; i > 0; i--) {
      const curElement = this.snakeBody[i] as HTMLElement;
      const nextElement = this.snakeBody[i - 1] as HTMLElement;
      curElement.style.left = nextElement.offsetLeft + 'px'
      curElement.style.top = nextElement.offsetTop + 'px'
    }
    
  }


}

class Controller {
  food: Food
  scoreboard: Scoreboard
  snake: Snake

  #moveKeyType: Array<string> = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']
  #setTimeoutID: number

  direction: string | null
  overGameFlag: boolean
  constructor() {
    this.food = new Food()
    this.scoreboard = new Scoreboard()
    this.snake = new Snake(20, 10)
    this.direction = null
    this.init()
    this.overGameFlag = false
  }
  init() {
    document.addEventListener('keydown', this.keyDownHandler.bind(this))
  }
  keyDownHandler(event: KeyboardEvent) {
    if (this.#moveKeyType.includes(event.key)) {
      this.setDirection(event.key)
      if (!this.overGameFlag) {
        this.move()
      }
    }
  }
  setDirection(val: string) {
    this.direction = val
  }
  move() {
    if (!this.direction) return
    try {
      switch (this.direction) {
        case 'ArrowRight':
          this.snake.snakeHeaderX += 10;
          break;
        case 'ArrowDown':
          this.snake.snakeHeaderY += 10;
          break;
        case 'ArrowLeft':
          this.snake.snakeHeaderX -= 10;
          break;
        case 'ArrowUp':
          this.snake.snakeHeaderY -= 10;
          break;
        default:
          // 处理未匹配到的情况
          break;
      }

      // 食物检测
      this.foodTesting()

      window.clearInterval(this.#setTimeoutID)
      this.#setTimeoutID = window.setTimeout(this.move.bind(this), 300 - (this.scoreboard.level * 30))
    } catch (error) {
      // 撞墙之后就结束游戏
      this.overGame()
    }
    
  }
  overGame() {
    this.overGameFlag = true
    console.log('游戏结束');
  }


  // 食物检测
  foodTesting() {
    if (!(this.food.foodX === this.snake.snakeHeaderX && this.food.foodY === this.snake.snakeHeaderY)) return
    
    this.scoreboard.addFraction()
    this.food.setOpsition()
    this.snake.addSnakeBody()
    if (this.scoreboard.fraction % this.scoreboard.stepLevel == 0) {
      this.scoreboard.addLevel()
      // 等级提升了之后更新定时器的间隔时间
      // this.updataMoveTime()
    }

  }
}

const controller = new Controller

