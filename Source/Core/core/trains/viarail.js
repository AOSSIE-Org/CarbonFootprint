var viarailManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.dataSource = "canada"; //select one of the emission information sources from trainEmissions.json
  this.MODE = ["viarail"]; // Currently average data is available only. Hence using general IRCTC name..
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("viarail");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("canada");
};

viarailManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "inherit";
  emission.style.margin = "0 6.4em";
  emission.style.padding = "0";
  return emission;
};

viarailManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

viarailManager.prototype.update = function() {
  if (document.querySelectorAll(".train-route-container").length === 0) return;
  var self = this;
  document.querySelectorAll(".train-route-container").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;
    var trainName = "viarail";
    var trainDurationArray = self.validator
      .querySelector(".schedule-info-duration", row)
      .textContent.trim()
      .split(" ");
    var trainDuration =
      parseInt(
        trainDurationArray[0]
          .split("")
          .splice(8)
          .join(""),
        10
      ) +
      parseInt(trainDurationArray[2], 10) / 60;
    debugger;
    if (!trainSpeedData[trainName]) trainName = "average";
    distanceBetween = trainSpeedData[trainName] * trainDuration;
    self.insertInDom(self.footprintCore.getEmission([self.MODE]), row);
  });
};

var WebsiteManager = viarailManager;
