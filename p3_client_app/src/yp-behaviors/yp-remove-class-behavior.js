import '@polymer/polymer/polymer-legacy.js';

/** @polymerBehavior Polymer.ypRemoveClassBehavior */
export const ypRemoveClassBehavior = {

  removeClass: function(element, classToRemove) {
    var newClassName = "";
    var classes = element.className.split(" ");
    for(var i = 0; i < classes.length; i++) {
      if(classes[i] !== classToRemove) {
        newClassName += classes[i] + " ";
      }
    }
    element.className = newClassName;
  }

};
