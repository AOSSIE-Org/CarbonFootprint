var southernRailManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "europe";
  this.MODE = ["uk"];
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("southernrailway");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("europe");
};

southernRailManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "small";
  return emission;
};

southernRailManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  element = this.validator.querySelector(".service-item__duration", element);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

southernRailManager.prototype.update = function() {
  if (document.querySelectorAll(".display__row").length === 0) return;
  var self = this;
  document.querySelectorAll(".display__row").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length !== 0) return;
    var trainName = "southernrailway",
      trainDuration;
    var trainDurationArray = self.validator
      .querySelector(".duration", row)
      .textContent.trim()
      .split(" ");
    if (trainDurationArray.length === 1) {
      trainDuration = parseInt(trainDurationArray[0], 10) / 60;
    } else trainDuration = parseInt(trainDurationArray[0], 10) + parseInt(trainDurationArray[1], 10) / 60;
    debugger;
    if (!trainSpeedData[trainName])
      trainName = trainSpeedData["uk"] ? "uk" : "average";
    distanceBetween = trainSpeedData[trainName] * trainDuration;
    self.insertInDom(self.footprintCore.getEmission([self.MODE]), row); //There is only 1 type of train
  });
};

var WebsiteManager = southernRailManager;
