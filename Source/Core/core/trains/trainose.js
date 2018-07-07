var trainoseManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("trainose");
  this.footprintCore.storeTrainSpeed("europe");
  this.footprintCore.storeDataSource(this.dataSource);
  this.subtree = true;
};

trainoseManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "small";
  emission.style.color = "black";
  return emission;
};

trainoseManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  console.log(emission);
  if (!element.querySelector(".carbon")) {
    element.appendChild(emission);
    return;
  }
};
trainoseManager.prototype.update = function() {
  debugger;
  if (document.querySelectorAll(".dromologio").length === 0) return;
  var self = this;
  document.querySelectorAll(".dromologio").forEach(function(row) {
    if (row.querySelector(".trip-segment")) {
      if (row.getElementsByClassName("carbon").length != 0) return;

      var totalFootPrint = 0;

      var fromArray = row.querySelectorAll(".tanax");
      var toArray = row.querySelectorAll(".tafix");
      var trainName = "trainose";
      if (!trainSpeedData[trainName])
        trainName = trainSpeedData["greece"] ? "greece" : "average";
      fromArray.forEach(function(val, index) {
        var fromTime = fromArray[index].textContent.trim().split(":");

        var toTime = toArray[index].textContent.trim().split(":");
        var startDate = new Date(0, 0, 0, fromTime[0], fromTime[1], 0);
        var endDate = new Date(0, 0, 0, toTime[0], toTime[1], 0);

        var diff = endDate.getTime() - startDate.getTime();
        var trainDuration = diff / (1000 * 60 * 60);
        if (trainDuration < 0) trainDuration = trainDuration + 24;
        distanceBetween = trainSpeedData[trainName] * trainDuration;
        totalFootPrint += trainData["greece"] * distanceBetween;
      });

      self.insertInDom(
        self.footprintCore.createHTMLElement(totalFootPrint),
        self.validator.querySelector(".dim.dashtop.sml9", row)
      );
    }
  });
};

var WebsiteManager = trainoseManager;
