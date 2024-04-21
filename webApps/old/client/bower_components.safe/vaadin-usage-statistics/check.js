var fs = require('fs');

if (process.env.npm_package_config_disabled) {
  console.log(`
    You have disabled Vaadin development time usage statistics collection. To re-enable, run:
    npm explore @vaadin/vaadin-usage-statistics -- npm run enable
    For more details, see https://github.com/vaadin/vaadin-usage-statistics
  `);

  try {
    fs.renameSync('vaadin-usage-statistics.js', 'vaadin-usage-statistics.js.bak');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('File not found!');
    } else {
      throw err;
    }
  }

  try {
    fs.renameSync('vaadin-usage-statistics-optout.js', 'vaadin-usage-statistics.js');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('File not found!');
    } else {
      throw err;
    }
  }
} else {
  console.log(`
    Vaadin collects development time usage statistics to improve this product. To opt-out, run:
    npm explore @vaadin/vaadin-usage-statistics -- npm run disable
    For more details, see https://github.com/vaadin/vaadin-usage-statistics
  `);
  /* restore backup files if previously disabled */
  if (fs.existsSync('vaadin-usage-statistics.js.bak')) {
    try {
      fs.renameSync('vaadin-usage-statistics.js', 'vaadin-usage-statistics-optout.js');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('File not found!');
      } else {
        throw err;
      }
    }

    try {
      fs.renameSync('vaadin-usage-statistics.js.bak', 'vaadin-usage-statistics.js');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('File not found!');

      } else {
        throw err;
      }
    }
  }
}

