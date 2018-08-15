var nswtrainlinkManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.MODE = ["nswtrainlink"];
  this.dataSource = "australia"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("nswtrainlink");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("australia");
};

nswtrainlinkManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "x-small";
  emission.style.padding = "0";
  return emission;
};

nswtrainlinkManager.prototype.insertInDom = function(emission, element) {
  element = this.validator.querySelector("td:nth-child(3)", element);
  emission = this.setStyle(emission);
  console.log(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

nswtrainlinkManager.prototype.update = function() {
  if (document.querySelectorAll(".tableSeparatorLine").length === 0) return;
  document.querySelectorAll(".tableSeparatorLine").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;
    var trainName = trainSpeedData["nswtrainlink"] ? "nswtrainlink" : "average";
    var trainDurationArray = this.validator
      .querySelector("td:nth-child(4) .tdPad", row)
      .textContent.trim()
      .split(" ");
    var trainDuration =
      parseInt(trainDurationArray[0], 10) +
      parseInt(trainDurationArray[1], 10) / 60;
    debugger;
    distanceBetween = trainSpeedData[trainName] * trainDuration;
    this.insertInDom(this.footprintCore.getEmission([this.MODE]), row); //There is only 1 type of train
  });
};

var WebsiteManager = nswtrainlinkManager;
