// USE uglify-es
const fs = require('fs').promises
const path = require('path')
const {execSync} = require('child_process');

async function walk(dir, fileList = []) {
  const files = await fs.readdir(dir)
  for (const file of files) {
    const stat = await fs.stat(path.join(dir, file))
    if (stat.isDirectory()) fileList = await walk(path.join(dir, file), fileList)
    else fileList.push(path.join(dir, file))
  }
  return fileList
}

walk('build/').then((results) => {
  let commandString, output;
  results.forEach((file)=>{
    console.log(file)
    if (file.endsWith(".html")) {
      commandString = "html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-js true "+file+" > /tmp/minify.html"
      console.log(commandString);
      output = execSync(commandString);
      commandString = "mv /tmp/minify.html "+file
      console.log(commandString);
      output = execSync(commandString);
    } else if (file.endsWith(".js")) {
      if (file!='build/bundled/bower_components/webcomponentsjs/custom-elements-es5-adapter.js') {
        commandString = "uglifyjs --compress --mangle -- "+file+" > /tmp/minify.js"
        console.log(commandString);
        output = execSync(commandString);
        commandString = "mv /tmp/minify.js "+file
        console.log(commandString);
        output = execSync(commandString);
      }
    }
  })
}).catch((error)=>{
  console.error(error);
})
