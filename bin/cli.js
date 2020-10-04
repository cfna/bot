#!/usr/bin/env node

const yargs = require('yargs')
const path = require('path')
const readline = require('readline')
const { MacroController } = require('../dist')
const { ScriptLoader } = require('../dist/utils')
const { runDebug } = require('../dist/runDebug')

const argv = yargs.option('macro', {
  alias: 'm', 
  type: 'string',
  description: 'Specify the macro file to execute' 
}).option('debug', {
  alias: 'd', 
  type: 'number',
  description: 'Debug: Print mouse coordinates in console. Specify the refresh ratio in ms'
}).argv

if (argv.debug) {
  try {
    execDebug(argv.debug)
  } catch (error) {
    console.error(`Error during debug session: ${error}`)
  }
} else if (!argv.macro) {
  yargs.showHelp()
  process.exit(1)
}

async function run() {
  const macroController = new MacroController()
  const scriptLoader = new ScriptLoader()
  const targetPath = path.isAbsolute(argv.macro) ? argv.macro : path.join(process.cwd(), argv.macro)
  const obj = await scriptLoader.load(targetPath)
  console.log(obj)
  macroController.executeMacro(obj)
}

async function execDebug(refreshRate) {
  // setup ctrl+c hook
  if(process.platform === "win32") {
    readline.createInterface({
      input: process.stdin,
      output: process.stdout
    }).on('SIGINT', () => {
      process.emit('SIGINT')
    })
  }

  let print = true
  let rfrshRate = refreshRate || 1000
  console.log(`Using refresh rate: ${rfrshRate}`)

  process.on('SIGINT', () => {
    print = false
  })

  function printDebug() {
    setTimeout(() => {
      if (print) {
        runDebug(printDebug)
      } else {
        console.log('Stopping Debug Session.')
        process.exit(0)
      }
    }, rfrshRate)
  }

  printDebug()

}

run()
