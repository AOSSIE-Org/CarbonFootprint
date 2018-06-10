var trenitaliaManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "europe";
  this.MODE = ["trenitalia"];
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("trenitalia");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("europe");
};

trenitaliaManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "large";
  return emission;
};

trenitaliaManager.prototype.insertInDom = function(emission, element) {
  var element = this.validator.querySelector("td:nth-child(6)", element);
  debugger;
  emission = this.setStyle(emission);
  console.log(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

trenitaliaManager.prototype.update = function() {
  if (document.querySelectorAll(".table-solution-hover").length === 0) return;
  var self = this;
  document
    .querySelectorAll(".panel .table-solution-hover")
    .forEach(function(row) {
      if (row.getElementsByClassName("carbon").length != 0) return;
      var trainDurationArray = self.validator
        .querySelector(".descr.duration.text-center")
        .textContent.trim()
        .split(" ")
        .map(function(e) {
          return parseInt(e);
        });
      var trainDuration = trainDurationArray[1] / 60 + trainDurationArray[0];

      distanceBetween = trainSpeedData["trenitalia"] * trainDuration;
      self.insertInDom(
        self.footprintCore.getEmission([self.MODE]),
        row.querySelector("tr")
      ); //There is only 1 type of train
    });
};

var WebsiteManager = trenitaliaManager;
