gemini.suite('vaadin-checkbox', function(rootSuite) {
  function wait(actions, find) {
    actions.wait(5000);
  }

  function goToAboutBlank(actions, find) {
    // Firefox stops responding on socket after a test, workaround:
    return actions.executeJS(function(window) {
      window.location.href = 'about:blank'; // just go away, please!
    });
  }

  rootSuite
    .before(wait)
    .after(goToAboutBlank);

  ['lumo', 'material'].forEach(theme => {
    gemini.suite(`default-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#default-tests')
        .capture('default')
        .capture('focus-ring', function(actions) {
          actions.executeJS(function(window) {
            window.document.querySelector('vaadin-checkbox').setAttribute('focus-ring', '');
          });
        })
        .capture('checked', function(actions) {
          actions.executeJS(function(window) {
            window.document.querySelector('vaadin-checkbox').checked = true;
          });
        });
    });

    gemini.suite(`group-tests-${theme}`, (suite) => {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#group-tests')
        .capture('default');
    });

    gemini.suite(`theme-vertical-group-tests-${theme}`, (suite) => {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#theme-vertical-group-tests')
        .capture('default');
    });

    gemini.suite(`disabled-group-tests-${theme}`, (suite) => {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#disabled-group-tests')
        .capture('default');
    });

    gemini.suite(`validation-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#validation-tests')
        .capture('error');
    });

    gemini.suite(`focus-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#focus-tests')
        .capture('focus');
    });

    gemini.suite(`wrapping-group-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#wrapping-group-tests')
        .capture('default');
    });

    gemini.suite(`helper-text-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default.html?theme=${theme}`)
        .setCaptureElements('#helper-text-tests')
        .capture('default');
    });

    if (theme === 'lumo') {
      gemini.suite(`helper-text-above-field-tests-${theme}`, function(suite) {
        suite
          .setUrl(`default.html?theme=${theme}`)
          .setCaptureElements('#helper-text-above-field-tests')
          .capture('default');
      });
    }

    if (theme === 'material') {
      gemini.suite(`validation-with-helper-tests-${theme}`, function(suite) {
        suite
          .setUrl(`default.html?theme=${theme}`)
          .setCaptureElements('#validation-with-helper-tests')
          .capture('default');
      });
    }

    gemini.suite(`default-rtl-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default-rtl.html?theme=${theme}`)
        .setCaptureElements('#default-tests')
        .capture('default')
        .capture('checked', function(actions) {
          actions.executeJS(function(window) {
            window.document.querySelector('vaadin-checkbox').checked = true;
          });
        });
    });

    gemini.suite(`validation-rtl-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default-rtl.html?theme=${theme}`)
        .setCaptureElements('#validation-tests')
        .capture('error');
    });

    gemini.suite(`wrapping-rtl-tests-${theme}`, function(suite) {
      suite
        .setUrl(`default-rtl.html?theme=${theme}`)
        .setCaptureElements('#wrapping-group-tests')
        .capture('default');
    });
  });

});
