var kayaktrainManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.MODE = ["uk"];
  this.dataSource = "europe"; //select one of the emission information sources from trainEmissions.json
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("kayak");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("europe");
};

kayaktrainManager.prototype.setStyle = function(emission) {
  emission.classList.add("detailsBlock");
  emission.style.fontSize = "small";
  emission.style.padding = "0";
  return emission;
};

kayaktrainManager.prototype.insertInDom = function(emission, element) {
  emission = this.setStyle(emission);
  console.log(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

kayaktrainManager.prototype.update = function() {
  if (document.querySelectorAll(".col-info.result-column").length === 0) return;
  var self = this;
  document.querySelectorAll(".col-info.result-column").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;
    var trainName = self.validator
      .querySelector(".detailsBlock.provider-name", row)
      .textContent.trim();
    var trainDurationArray = self.validator
      .querySelector(".col-field.duration .top", row)
      .textContent.trim()
      .split(" ");
    var trainDuration =
      parseInt(trainDurationArray[0], 10) +
      parseInt(trainDurationArray[1], 10) / 60;
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
      distanceBetween = trainSpeedData["uk"] * trainDuration;
    self.insertInDom(
      self.footprintCore.getEmission([self.MODE]),
      self.validator.querySelector(".detailsRow", row)
    ); //There is only 1 type of train
  });
};

var WebsiteManager = kayaktrainManager;
