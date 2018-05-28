var goibiboManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "irctc"; //select one of the emission information sources from trainEmissions.json
  this.MODE = ["irctc"]; // Currently average data is available only. Hence using general IRCTC name..
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("goibibo");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("india");
};

goibiboManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "small";
  emission.querySelector("svg").style.margin = "2px 5px";
  return emission;
};

goibiboManager.prototype.insertInDom = function(emission, element) {
  var element = this.validator.querySelector(".trainSrpDetail", element)
    .firstChild;
  emission = this.setStyle(emission);
  console.log(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

goibiboManager.prototype.update = function() {
  if (document.querySelectorAll(".srpCard").length === 0) return;
  var self = this;
  document.querySelectorAll(".srpCard").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;
    var trainName = self.validator
      .querySelector(".width100.fl.ico18.greyDr.fmed", row)
      .textContent.trim();
    var trainDuration =
      parseInt(
        self.validator
          .querySelector(".fl.ico15.fmed.greyDr", row)
          .textContent.split(" ")[0],
        10
      ) +
      parseInt(
        self.validator
          .querySelector(".fl.ico15.fmed.greyDr", row)
          .textContent.split(" ")[1],
        10
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

var WebsiteManager = goibiboManager;
