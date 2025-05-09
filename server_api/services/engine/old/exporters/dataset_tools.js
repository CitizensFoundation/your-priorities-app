var removeDiacritics = require('diacritics').remove;

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

var clean = function (string) {
  string = string.replace(/(\r\n|\n|\r)/gm," ");
  string = string.replace(',',' ');
  string = string.replace('\n',' ');
  string = string.replace(/\'/g,' ');
  string = string.replace(/\,/g,' ');
  string = string.replace(/\(/g,' ');
  string = string.replace(/\=/g,' ');
  string = string.replace(/\)/g,' ');
  string = string.replace(/\-/g,' ');
  string = string.replace(/\./g,' ');
  string = string.replace(/['"]+/g, '');
  string = string.replace(/<a\b[^>]*>(.*?)<\/a>/i," ");
  string = removeDiacritics(string);
  string = string.replace(/[^A-Za-z0-9(),!?\'\`]/, ' ');
  string = string.replace(/[^\x00-\x7F]/g, " ");
  string = string.replace(/\s+/g,' ').trim();
  return string;
};

var replaceBetterReykjavikCategoryId = function (id) {
  if ([1,2,19,24,18,16,20,23,17,21,13,25,22,14].indexOf(id) > -1) {
    return 2;
  } else {
    switch(id) {
      case 4:
        return 1;
        break;
      case 3:
        return 3;
        break;
      case 15:
        return 4;
        break;
      case 11:
        return 5;
        break;
      case 8:
        return 6;
        break;
      case 9:
        return 7;
        break;
      case 10:
        return 8;
        break;
      case 12:
        return 9;
        break;
      case 5:
        return 10;
        break;
      case 26:
        return 11;
        break;
      case 6:
        return 12;
        break;
      case 7:
        return 13;
        break;
    }
  }
};

module.exports = {
  replaceBetterReykjavikCategoryId: replaceBetterReykjavikCategoryId,
  clean: clean,
  shuffleArray: shuffleArray
};