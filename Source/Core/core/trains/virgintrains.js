var virgintrainsManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.MODE = ["virgintrains"];
  this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("virgintrains");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("europe");
};

virgintrainsManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "small";
  emission.querySelector("a").style["font-weight"] = "500";
  emission.style.padding = "0";
  return emission;
};

virgintrainsManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  console.log(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

virgintrainsManager.prototype.update = function() {
  if (document.querySelectorAll(".container").length === 0) return;
  document.querySelectorAll(".container").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;
    var trainName = "virgintrains";
    var trainDurationArray = this.validator
      .querySelector(".journey_duration", row)
      .textContent.trim()
      .split(" ");
    var trainDuration =
      parseInt(trainDurationArray[0], 10) +
      parseInt(trainDurationArray[1], 10) / 60;
    debugger;
    if (!trainSpeedData[trainName])
      trainName = trainSpeedData["uk"] ? "uk" : "average";
    distanceBetween = trainSpeedData[trainName] * trainDuration;
    this.insertInDom(
      this.footprintCore.getEmission([this.MODE]),
      this.validator.querySelector(".content_wrapper", row)
    );
  });
};

var WebsiteManager = virgintrainsManager;
