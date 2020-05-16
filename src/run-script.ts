import yargs from 'yargs';
import path from 'path';
import { ScriptLoader } from './utils';
import { MacroController } from '.'

const argv = yargs.option('script', {
  alias: 's',
}).argv;

if(!argv.script) {
  yargs.showHelp();
  process.exit(1);
}

async function main() {
  const macroController = new MacroController()
  const scriptLoader = new ScriptLoader();
  const targetPath = path.isAbsolute(argv.script as string) ? argv.script as string : path.join(process.cwd(), argv.script as string);
  const obj = await scriptLoader.load(targetPath);
  console.log(obj);
  macroController.executeMacro(obj);
}

main();
