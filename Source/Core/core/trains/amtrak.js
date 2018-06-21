var amtrackRailManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "america";
  this.MODE = ["amtrack"];
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("amtrack");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("america");
};

amtrackRailManager.prototype.setStyle = function(emission) {
  emission.querySelector("a").style.color = "#fffff4";
  emission.style.float = "left";
  emission.style["padding-top"] = "3px";
  emission.style["margin-left"] = "1em";
  return emission;
};

amtrackRailManager.prototype.insertInDom = function(emission, element) {
  element = element.querySelector(
    ".row.header_no_margin.row-divided.train_detail_row .column-one"
  );
  emission = this.setStyle(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

amtrackRailManager.prototype.update = function() {
  if (document.querySelectorAll(".container-fluid").length === 0) return;
  var self = this;
  document.querySelectorAll(".train-select-heading").forEach(function(row) {
    if (!row.querySelector(".container-fluid")) return;
    if (row.getElementsByClassName("carbon").length !== 0) return;
    var trainName = "amtrack";
    debugger;
    var trainDurationArray = self.validator
      .querySelector(".ff_seg_duration", row)
      .textContent.split(" ");
    var trainDuration =
      parseInt(
        trainDurationArray[0]
          .split("")
          .slice(1)
          .join(""),
        10
      ) +
      parseInt(trainDurationArray[1], 10) / 60;
    debugger;
    if (!trainSpeedData[trainName]) trainName = "average";
    distanceBetween = trainSpeedData[trainName] * trainDuration;
    self.insertInDom(self.footprintCore.getEmission([self.MODE]), row);
  });
};

var WebsiteManager = amtrackRailManager;
