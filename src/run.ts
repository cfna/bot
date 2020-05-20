import { ScreenController } from '.'
import robot from 'robotjs'
import { createLogger, Logger } from './utils'

function run(): void {
  const sc = new ScreenController()
  sc.printScreenInfo()
  sc.capture(0, 0, 800, 600)
}

let prevPos = { x: 0, y: 0 }

function queryMousePosition() {
  const logger = createLogger()
  getMousePos(logger)
}

function getMousePos(logger: Logger) {
  setTimeout(() => {
    const position = robot.getMousePos()
    if(position && position.x !== prevPos.x && position.y !== prevPos.y) {
      logger.info(`Mouse Position: x=${position.x} y=${position.y}`)
      prevPos = position
    }
    getMousePos(logger)
  }, 1000)
}

// run();
if(false) {
  run()
}
queryMousePosition()
