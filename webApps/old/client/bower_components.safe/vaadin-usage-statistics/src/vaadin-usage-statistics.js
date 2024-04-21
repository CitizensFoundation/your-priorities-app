const getPolymerVersion = () => window.Polymer && window.Polymer.version;

class StatisticsGatherer {
  constructor(logger) {
    this.now = new Date().getTime();
    this.logger = logger;
  }

  frameworkVersionDetectors() {
    return {
      'Flow': function () {
        if (window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients) {
          var flowVersions = Object.keys(window.Vaadin.Flow.clients)
            .map(key => window.Vaadin.Flow.clients[key])
            .filter(client => client.getVersionInfo)
            .map(client => client.getVersionInfo().flow);
          if (flowVersions.length > 0) {
            return flowVersions[0];
          }
        }
      },
      'Vaadin Framework': function () {
        if (window.vaadin && window.vaadin.clients) {
          var frameworkVersions = Object.values(window.vaadin.clients)
            .filter(client => client.getVersionInfo)
            .map(client => client.getVersionInfo().vaadinVersion);
          if (frameworkVersions.length > 0) {
            return frameworkVersions[0];
          }
        }
      },
      'AngularJs': function () {
        if (window.angular && window.angular.version && window.angular.version) {
          return window.angular.version.full;
        }
      },
      'Angular': function () {
        if (window.ng) {
          const tags = document.querySelectorAll("[ng-version]");
          if (tags.length > 0) {
            return tags[0].getAttribute("ng-version");
          }
          return "Unknown";
        }
      },
      'Backbone.js': function () {
        if (window.Backbone) {
          return window.Backbone.VERSION;
        }
      },
      'React': function () {
        var reactSelector = '[data-reactroot], [data-reactid]';
        if (!!document.querySelector(reactSelector)) {
          // React does not publish the version by default
          return "unknown";
        }
      },
      'Ember': function () {
        if (window.Em && window.Em.VERSION) {
          return window.Em.VERSION;
        } else if (window.Ember && window.Ember.VERSION) {
          return window.Ember.VERSION;
        }
      },
      'jQuery': function () {
        if (typeof jQuery === 'function' && jQuery.prototype.jquery !== undefined) {
          return jQuery.prototype.jquery;
        }
      },
      'Polymer': function () {
        const version = getPolymerVersion();
        if (version) {
          return version;
        }
      },
      'Vue.js': function () {
        if (window.Vue) {
          return window.Vue.version;
        }
      }
    };
  };
  getUsedVaadinElements(elements) {
    const version = getPolymerVersion();
    let elementClasses;
    if (version && version.indexOf('2') === 0) {
      // Polymer 2: components classes are stored in window.Vaadin
      elementClasses = Object.keys(window.Vaadin).map(c => window.Vaadin[c]).filter(c => c.is);
    } else {
      // Polymer 3: components classes are stored in window.Vaadin.registrations
      elementClasses = window.Vaadin.registrations || [];
    }
    elementClasses.forEach(klass => {
      const version = klass.version ? klass.version : "0.0.0";
      elements[klass.is] = {version};
    });
  }
  getUsedVaadinThemes(themes) {
    [
      'Lumo',
      'Material'
    ].forEach(themeName => {
      var theme;
      var version = getPolymerVersion();
      if (version && version.indexOf('2') === 0) {
        // Polymer 2: themes are stored in window.Vaadin
        theme = window.Vaadin[themeName];
      } else {
        // Polymer 3: themes are stored in custom element registry
        theme = customElements.get(`vaadin-${themeName.toLowerCase()}-styles`);
      }
      if (theme && theme.version) {
        themes[themeName] = {version: theme.version};
      }
    });
  }
  getFrameworks(frameworks) {
    const detectors = this.frameworkVersionDetectors();
    Object.keys((detectors)).forEach(framework => {
      const detector = detectors[framework];
      try {
        const version = detector();
        if (version) {
          frameworks[framework] = { "version": version };
        }
      } catch (e) {
      }
    });
  };

  gather(storage) {
    const storedStats = storage.read();
    var gatheredStats = {};
    const types = ["elements", "frameworks", "themes"];

    types.forEach(type => {
      gatheredStats[type] = {};
      if (!storedStats[type]) {
        storedStats[type] = {};
      }
    });

    var previousStats = JSON.stringify(storedStats);

    this.getUsedVaadinElements(gatheredStats.elements);
    this.getFrameworks(gatheredStats.frameworks);
    this.getUsedVaadinThemes(gatheredStats.themes);

    const now = this.now;
    types.forEach(type => {
      const keys = Object.keys(gatheredStats[type]);
      keys.forEach(key => {
        if (!storedStats[type][key] || typeof storedStats[type][key] != typeof {}) {
          storedStats[type][key] = { "firstUsed": now };
        }
        // Discards any previously logged version numebr
        storedStats[type][key].version = gatheredStats[type][key].version;
        storedStats[type][key].lastUsed = now;
      });
    });

    const newStats = JSON.stringify(storedStats);
    storage.write(newStats);
    if (newStats != previousStats && Object.keys(storedStats).length > 0) {
      this.logger.debug("New stats: " + newStats);
    }
  };
}

class StatisticsStorage {
  constructor(key) {
    this.key = key;
  }
  read() {
    const localStorageStatsString = localStorage.getItem(this.key);
    try {
      return JSON.parse(localStorageStatsString ? localStorageStatsString : '{}');
    } catch (e) {
      return {};
    }
  }
  write(data) {
    localStorage.setItem(this.key, data);
  }
  clear() {
    localStorage.removeItem(this.key);
  }
  isEmpty() {
    const storedStats = this.read();
    var empty = true;
    Object.keys(storedStats).forEach(key => {
      if (Object.keys(storedStats[key]).length > 0) {
        empty = false;
      }
    });

    return empty;
  }


}
class StatisticsSender {
  constructor(url, logger) {
    this.url = url;
    this.logger = logger;
  }

  send(data, errorHandler) {
    const logger = this.logger;

    if (navigator.onLine === false) {
      logger.debug("Offline, can't send");
      errorHandler();
      return;
    }
    logger.debug("Sending data to " + this.url);

    var req = new XMLHttpRequest();
    req.withCredentials = true;
    req.addEventListener("load", function () {
      // Stats sent, nothing more to do
      logger.debug("Response: " + req.responseText);
    });
    req.addEventListener("error", function () {
      logger.debug("Send failed");
      errorHandler();
    });
    req.addEventListener("abort", function () {
      logger.debug("Send aborted");
      errorHandler();
    });
    req.open("POST", this.url);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(data);
  }
}
class StatisticsLogger {
  constructor(id) {
    this.id = id;
  }

  _isDebug() {
    return localStorage.getItem("vaadin." + this.id + ".debug");
  }

  debug(msg) {
    if (this._isDebug()) {
      console.info(this.id + ": " + msg);
    }
  }
}

class UsageStatistics {
  constructor() {
    this.now = new Date();
    this.timeNow = this.now.getTime();
    this.gatherDelay = 10; // Delay between loading this file and gathering stats
    this.initialDelay = 24 * 60 * 60;

    this.logger = new StatisticsLogger("statistics");
    this.storage = new StatisticsStorage("vaadin.statistics.basket");
    this.gatherer = new StatisticsGatherer(this.logger);
    this.sender = new StatisticsSender("https://tools.vaadin.com/usage-stats/submit", this.logger);

  }
  static get version() {
    return '2.0.1';
  }
  static get firstUseKey() {
    return 'vaadin.statistics.firstuse';
  }
  static get monthProcessedKey() {
    return 'vaadin.statistics.monthProcessed';
  }
  static get optOutKey() {
    return 'vaadin.statistics.optout';
  }

  maybeGatherAndSend() {
    if (localStorage.getItem(UsageStatistics.optOutKey)) {
      return;
    }
    this.gatherer.gather(this.storage);
    setTimeout(() => {
      this.maybeSend();
    }, this.gatherDelay * 1000);
  }

  lottery() {
    return Math.random() <= 0.05;
  }

  currentMonth() {
    return this.now.getYear() * 12 + this.now.getMonth();
  }

  maybeSend() {
    var firstUse = Number(localStorage.getItem(UsageStatistics.firstUseKey));
    const monthProcessed = Number(localStorage.getItem(UsageStatistics.monthProcessedKey));

    if (!firstUse) {
      // Use a grace period to avoid interfering with tests, incognito mode etc
      firstUse = this.timeNow;
      localStorage.setItem(UsageStatistics.firstUseKey, firstUse);
    }

    if (this.timeNow < (firstUse + this.initialDelay * 1000)) {
      this.logger.debug("No statistics will be sent until the initial delay of " + this.initialDelay + "s has passed");
      return;
    }
    if (this.currentMonth() <= monthProcessed) {
      this.logger.debug("This month has already been processed");
      return;
    }
    localStorage.setItem(UsageStatistics.monthProcessedKey, this.currentMonth());
    // Use random sampling
    if (this.lottery()) {
      this.logger.debug("Congratulations, we have a winner!");
    } else {
      this.logger.debug("Sorry, no stats from you this time");
      return;
    }

    this.send();
  }

  send() {
    // Ensure we have the latest data
    this.gatherer.gather(this.storage);

    // Read, send and clean up
    var data = this.storage.read();
    data["firstUse"] = Number(localStorage.getItem(UsageStatistics.firstUseKey));
    data["usageStatisticsVersion"] = UsageStatistics.version;
    const info = 'This request contains usage statistics gathered from the application running in development mode. \n\nStatistics gathering is automatically disabled and excluded from production builds.\n\nFor details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.\n\n\n\n';
    var self = this;
    this.sender.send(info + JSON.stringify(data), function () {
      // Revert the 'month processed' flag
      localStorage.setItem(UsageStatistics.monthProcessedKey, self.currentMonth() - 1);
    });
  }
}

try {
  window.Vaadin = window.Vaadin || {};
  window.Vaadin.usageStatsChecker = window.Vaadin.usageStatsChecker || new UsageStatistics();
  window.Vaadin.usageStatsChecker.maybeGatherAndSend();
} catch (e) {
  // Intentionally ignored as this is not a problem in the app being developed
}
