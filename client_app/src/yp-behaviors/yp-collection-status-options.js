import '../../../../@polymer/polymer/polymer.js';

export const ypCollectionStatusOptions = {

  properties: {
    collectionStatusOptions: {
      type: Object,
      computed: '_collectionStatusOptions(language)'
    }
  },

  _collectionStatusOptions: function(language) {
    if (language) {
      return [
        {name: 'active', translatedName: this.t('status.active')},
        {name: 'featured', translatedName: this.t('status.featured')},
        {name: 'archived', translatedName: this.t('status.archived')},
        {name: 'hidden', translatedName: this.t('status.hidden')}
      ]
    } else {
      return [];
    }
  }
};
