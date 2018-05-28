var yatraManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "irctc"; //select one of the emission information sources from trainEmissions.json
  this.MODE = ["irctc"]; // Currently average data is available only. Hence using general IRCTC name..
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("yatra");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("india");
};

yatraManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "x-large";
  return emission;
};

yatraManager.prototype.insertInDom = function(emission, element) {
  var li = this.validator.querySelector("li", element);
  emission = this.setStyle(emission);
  console.log(emission);
  li.appendChild(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(li);
  }
};

yatraManager.prototype.update = function() {
  if (document.querySelectorAll(".train-info-block.true").length === 0) return;
  var self = this;
  document.querySelectorAll(".train-info-block.true").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;
    var trainName = self.validator
      .getByClass("trainName", row)[0]
      .textContent.split("(")[0]
      .trim();
    var trainDuration =
      Number(
        self.validator
          .getByClass("trainDuration", row)[0]
          .textContent.split(":")[0]
      ) +
      Number(
        self.validator
          .getByClass("trainDuration", row)[0]
          .textContent.split(":")[1]
      ) /
        60;
    debugger;
    var usingAverageSpeed = true;
    for (trainTestString in trainSpeedData) {
      trainName.split(" ").forEach(function(word) {
        if (
          self.footprintCore.fuzzySearch(word.toLowerCase(), trainTestString)
        ) {
          usingAverageSpeed = false;
          distanceBetween = trainDuration * trainSpeedData[trainTestString];
          return;
        }
      });
      if (!usingAverageSpeed) break;
    }
    if (usingAverageSpeed)
      distanceBetween = trainSpeedData["average"] * trainDuration;
    self.insertInDom(self.footprintCore.getEmission([self.MODE]), row); //There is only 1 type of train
  });
};

var WebsiteManager = yatraManager;
