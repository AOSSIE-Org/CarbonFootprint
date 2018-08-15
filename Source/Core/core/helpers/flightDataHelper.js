var FlightDataHelper = function() {};

FlightDataHelper.prototype.getData = function(link, cb) {
  var req = new XMLHttpRequest();
  var data;
  req.open("GET", Helper.getFilePath(link));
  req.onreadystatechange = function(ev) {
    if (req.readyState == 4) {
      if (req.status == 200 || req.status == 0) {
        cb(JSON.parse(req.responseText));
      }
    }
  };
  req.send();
  return data;
};
