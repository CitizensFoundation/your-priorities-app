import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior Polymer.ypIronListBehavior
 */
export const ypIronListBehavior = {

  properties: {
    wide: {
      type: Boolean,
      observer: '_wideChanged'
    },

    resizeTimer: Object
  },

  attached: function () {
    this.async(function () {
      this.resetListSize();
      window.addEventListener("resize", this.resetListSizeWithDelay.bind(this));
    }.bind(this));
  },

  detached: function() {
    window.removeEventListener("resize", this.resetListSizeWithDelay);
  },

  _wideChanged: function () {
    this.resetListSize();
  },

  resetListSizeWithDelay: function () {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(function() {
      this.resetListSize();
    }.bind(this), 250);
  },

  resetListSize: function (ironListId) {
    if (!ironListId) {
      ironListId = "#ironList";
    }
    var list = this.$$(ironListId);
    if (list) {
      var skipHeight = true;
      var windowHeight = window.innerHeight;
      var windowWidth = window.innerWidth;
      if (list) {
        var height;
        if (this.wide) {
          height = windowHeight - (this.wideListOffset ? this.wideListOffset : 415);
        } else {
          height = windowHeight - 300;
          windowWidth = windowWidth - 16;
        }

        if (!skipHeight) {
          list.style.height = height + 'px';
        }

        if (!this.skipIronListWidth) {
          list.style.width = windowWidth + 'px';
        } else {
          console.log("Skipping setting iron-list width");
        }
        this.async(function () {
          list.updateViewportBoundaries();
          this.async(function () {
            list.notifyResize();
          })
        });
      } else {
        console.error("Can't find iron list, waiting");
        this.async(function () {
          this.resetListSize();
        },1500);
      }
    }
  }
};
