#!/usr/bin/env node

const yargs = require('yargs')
const path = require('path')
const { MacroController } = require('../dist')
const { ScriptLoader } = require('../dist/utils')

const argv = yargs.option('macro', {alias: 'm', type: 'string' }).argv

if (!argv.macro) {
  yargs.showHelp()
  process.exit(1)
}

console.log(argv)

async function run() {
  const macroController = new MacroController()
  const scriptLoader = new ScriptLoader()
  const targetPath = path.isAbsolute(argv.macro) ? argv.macro : path.join(process.cwd(), argv.macro)
  const obj = await scriptLoader.load(targetPath)
  console.log(obj)
  macroController.executeMacro(obj)
}

run()
