gemini.suite('vaadin-grid', (rootSuite) => {

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
    ['ltr', 'rtl'].forEach(direction => {
      gemini.suite(`header-footer-${theme}-${direction}`, (suite) => {
        suite
          .setUrl(`header-footer.html?theme=${theme}&dir=${direction}`)
          .setCaptureElements('#header-footer')
          .capture('header-footer', {}, (actions, find) => {
            actions.wait(6000);
          });
      });

      gemini.suite(`column-groups-${theme}-${direction}`, (suite) => {
        suite
          .setUrl(`column-groups.html?theme=${theme}&dir=${direction}`)
          .setCaptureElements('#column-groups')
          .capture('column-groups', {}, (actions, find) => {
            actions.wait(6000);
          });
      });

      gemini.suite(`row-details-${theme}-${direction}`, (suite) => {
        suite
          .setUrl(`row-details.html?theme=${theme}`)
          .setCaptureElements('#row-details')
          .capture('row-details-initial', {}, (actions, find) => {
            actions.wait(6000);
          })
          .capture('row-details-visible', {}, (actions, find) => {
            actions.executeJS(function(window) {
              var grid = window.document.querySelector('vaadin-grid');
              grid.openItemDetails(grid.items[0]);
            });
          });
      });

      gemini.suite(`sorting-${theme}-${direction}`, (suite) => {
        suite
          .setUrl(`sorting.html?theme=${theme}&dir=${direction}`)
          .setCaptureElements('#sorting')
          .capture('sorting-initial', {}, (actions, find) => {
            actions.wait(6000);
          })
          .before((actions, find) => {
            this.firstNameSorter = find('#first-name-sorter');
            this.lastNameSorter = find('#last-name-sorter');
          })
          .capture('single-column-asc', {}, (actions, find) => {
            actions.click(this.firstNameSorter);
          })
          .capture('multiple-columns-asc-asc', {}, (actions, find) => {
            actions.click(this.lastNameSorter);
          })
          .capture('multiple-columns-asc-desc', {}, (actions, find) => {
            actions.click(this.lastNameSorter);
          })
          .capture('single-column-desc', {}, (actions, find) => {
            actions.click(this.lastNameSorter);
            actions.click(this.firstNameSorter);
          });
      });
    });

    gemini.suite(`drag-and-drop-${theme}`, (suite) => {
      suite
        .setUrl(`drag-and-drop.html?theme=${theme}`)
        .setCaptureElements('.capture-block')
        .capture('grid-dragover', {}, (actions, find) => {
          actions.executeJS(function(window) {
            var grid = window.document.querySelector('vaadin-grid');
            grid.setAttribute('dragover', '');
          });
          actions.wait(6000);
        })
        .capture('row-dragover-on-top', {}, (actions, find) => {
          actions.executeJS(function(window) {
            var grid = window.document.querySelector('vaadin-grid');
            grid.removeAttribute('dragover');
            grid.$.items.children[1].setAttribute('dragover', 'on-top');
          });
        })
        .capture('row-dragover-above', {}, (actions, find) => {
          actions.executeJS(function(window) {
            var grid = window.document.querySelector('vaadin-grid');
            grid.$.items.children[1].setAttribute('dragover', 'above');
          });
        })
        .capture('row-dragover-below', {}, (actions, find) => {
          actions.executeJS(function(window) {
            var grid = window.document.querySelector('vaadin-grid');
            grid.$.items.children[1].setAttribute('dragover', 'below');
          });
        })
        .capture('row-dragover-above-details', {}, (actions, find) => {
          actions.executeJS(function(window) {
            var grid = window.document.querySelector('vaadin-grid');
            grid.detailsOpenedItems = [grid.items[1]];
            grid.$.items.children[1].setAttribute('dragover', 'above');
          });
        })
        .capture('row-dragover-below-details', {}, (actions, find) => {
          actions.executeJS(function(window) {
            var grid = window.document.querySelector('vaadin-grid');
            grid.detailsOpenedItems = [grid.items[1]];
            grid.$.items.children[1].setAttribute('dragover', 'below');
          });
        })
        .capture('row-dragstart', {}, (actions, find) => {
          actions.executeJS(function(window) {
            var grid = window.document.querySelector('vaadin-grid');
            grid.detailsOpenedItems = [];
            grid.$.items.children[1].removeAttribute('dragover');
            grid.$.items.children[1].setAttribute('dragstart', '123');
          });
        })
        .capture('dragstart-below-last-row-all-rows-visible', {}, (actions) => {
          actions.executeJS(function(window) {
            var grid = window.document.querySelector('vaadin-grid');
            grid.allRowsVisible = true;
            grid.items = grid.items.slice(0, 2);
            grid.$.items.children[1].removeAttribute('dragstart');
            grid.$.items.children[1].setAttribute('dragover', 'below');
          });
        });
    });
  });

});
