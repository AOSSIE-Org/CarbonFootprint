var nationalRailManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "europe";
  this.MODE = ["nationalrail"];
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("nationalrail");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("europe");
};

nationalRailManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "small";
  return emission;
};

nationalRailManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  element = this.validator.querySelector(".from", element);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

nationalRailManager.prototype.update = function() {
  if (document.querySelectorAll(".mtx").length === 0) return;
  var self = this;
  document.querySelectorAll(".mtx").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length !== 0) return;
    var trainName = "nationalrail";
    var trainDuration =
      Number(
        self.validator
          .querySelector(".dur abbr[title=hours]", row)
          .previousSibling.textContent.trim()
      ) +
      Number(
        self.validator
          .querySelector(".dur abbr[title=minutes]", row)
          .previousSibling.textContent.trim()
      ) /
        60;
    debugger;
    distanceBetween = trainSpeedData[trainName] * trainDuration;
    self.insertInDom(self.footprintCore.getEmission([self.MODE]), row); //There is only 1 type of train
  });
};

var WebsiteManager = nationalRailManager;
