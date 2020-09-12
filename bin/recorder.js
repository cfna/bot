const readline = require('readline')
const fs = require('fs')
const path = require('path')
const { MouseController } = require('../dist')

// static constants
const TIMEOUT = 100
const MOUSE_MOVEMENT_SMOOTH = true
const REPEAT_COUNTER = 1
const SCRIPT_NAME = "test-recording"

// code variables
const storedPositions = []
const mouseController = new MouseController()

let lastPosition
let interruptRequested = false
let isStarted = false


// exec entry point
readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

process.stdin.on('keypress', handleKeypressEvent)

console.log('Press CTRL+S to start/stop recording.')

// functions

async function handleKeypressEvent(str, key) {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else if (key.ctrl && key.name === 's') {
    if (isStarted) {
      interruptRequested = true
      const macro = convertRecordedPositions()
      await saveRecordedMacroToDisk(macro)
      console.log(">> Recording finished.")
    } else {
      isStarted = true
      queryAndRecordMousePosition()
      console.log(">> Recording started.")
    }
  }
}

function queryAndRecordMousePosition() {
  setTimeout(() => {
    const position = mouseController.getCurrentPosition()
    if (position && position.x && position.y && !isSamePositionAsPrevious(position)) {
      storedPositions.push(position)
    }
    if (!interruptRequested) {
      queryAndRecordMousePosition()
    }
  }, TIMEOUT)
}

function isSamePositionAsPrevious(position) {
  if (!lastPosition) {
    return false
  }
  return position.x === lastPosition.x && position.y === lastPosition.y
}

function convertRecordedPositions() {
  return {
    name: SCRIPT_NAME,
    repeat: REPEAT_COUNTER,
    actions: storedPositions.map(position => {
      return {
        type: "mouse",
        action: "move",
        location: position,
        smooth: MOUSE_MOVEMENT_SMOOTH,
      }
    })
  }
}

async function saveRecordedMacroToDisk(macro) {
  const outDir = path.join(process.cwd(), 'recordings')
  await fs.mkdirSync(outDir)
  const outFile = path.join(outDir, `recording-${Date.now()}.json`)
  console.log(`Saving file: ${outFile}`)
  return fs.writeFileSync(outFile, JSON.stringify(macro), {encoding: 'utf-8'})
}
