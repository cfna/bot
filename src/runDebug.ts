import robot from 'robotjs'
import { createLogger } from './utils'

let prevPos = { x: 0, y: 0 }
const logger = createLogger()

export function runDebug(fun: () => void) {
  const position = robot.getMousePos()
    if(position && position.x !== prevPos.x && position.y !== prevPos.y) {
      logger.info(`Mouse Position: x=${position.x} y=${position.y}`)
      prevPos = position
    }
    fun()
}
