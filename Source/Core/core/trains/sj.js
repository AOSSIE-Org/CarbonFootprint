var sjManager = function(footprintCore, settingsProvider) {
  this.footprintCore = footprintCore;
  this.settingsProvider = settingsProvider;
  this.subtree = true;
  this.dataSource = "europe";
  this.MODE = ["sj"];
  this.stations = {
    arrive: "",
    depart: ""
  };
  this.validator = new TrainsValidator("sj");
  this.footprintCore.storeDataSource(this.dataSource);
  this.footprintCore.storeTrainSpeed("europe");
};

sjManager.prototype.setStyle = function(emission) {
  emission.style.fontSize = "small";
  return emission;
};

sjManager.prototype.insertInDom = function(emission, element) {
  debugger;
  emission = this.setStyle(emission);
  console.log(emission);
  if (element.getElementsByClassName("carbon").length === 0) {
    element.appendChild(emission);
  }
};

sjManager.prototype.update = function() {
  if (document.querySelectorAll(".timetable__table-rows.ng-scope").length === 0)
    return;
  var self = this;
  document
    .querySelectorAll(".timetable__table-rows.ng-scope")
    .forEach(function(row) {
      if (row.getElementsByClassName("carbon").length != 0) return;
      var trainDurationArray = self.validator
        .querySelector(
          ".timetable__extra-info-item.ng-isolate-scope.ng-binding",
          row
        )
        .textContent.trim()
        .split(":")
        .map(function(e) {
          return parseInt(e);
        });
      var trainDuration = trainDurationArray[1] / 60 + trainDurationArray[0];

      distanceBetween = trainSpeedData["sj"] * trainDuration;
      self.insertInDom(
        self.footprintCore.getEmission([self.MODE]),
        row.querySelector(".timetable__extra-info span.ng-binding")
      ); //There is only 1 type of train
    });
};

var WebsiteManager = sjManager;
