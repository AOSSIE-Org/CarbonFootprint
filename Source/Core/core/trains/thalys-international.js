var thalysManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "sncf"; //select one of the emission information sources from trainEmissions.json
  this.speedDataSource = "europe"; //select one of the speed information sources from trains.json

  this.stations = {
    arrive: "",
    depart: ""
  };
  this.MODE = "thalys"; // constant, the type of train on this website is only "thalys"
  this.validator = new TrainsValidator("thalys");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("europe");
};

thalysManager.prototype.setStyle = function(emission) {
  emission.style.marginLeft = "10px";
  emission.style.fontSize = "small";
  return emission;
};

thalysManager.prototype.insertInDom = function(emission, row) {
  emission = this.setStyle(emission);
  console.log(emission);
  var element = this.validator.getByClass("rt-connection-logos", row)[0];
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

thalysManager.prototype.update = function() {
  debugger;
  var self = this;
  document.querySelectorAll(".rt-connection").forEach(function(row) {
    if (row.getElementsByClassName("carbon").length != 0) return;
    var trainDuration =
      Number(
        self.validator
          .querySelector(".rt-connection-info-duration.selectorDuration", row)
          .textContent.split(":")[0]
      ) +
      Number(
        self.validator
          .querySelector(".rt-connection-info-duration.selectorDuration", row)
          .textContent.split(":")[1]
      ) /
        60;
    distanceBetween = trainDuration * trainSpeedData["thalys"];
    self.insertInDom(self.footprintCore.getEmission([self.MODE]), row); //There is only 1 type of train
  });
};

var WebsiteManager = thalysManager;
