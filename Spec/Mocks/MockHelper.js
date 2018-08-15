var MockHelper = function() {};

MockHelper.prototype.getFilePath = function(filename) {
  return filename;
};

var Helper = new MockHelper();
